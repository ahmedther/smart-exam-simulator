import re
import os
import json
from pathlib import Path
from typing import Dict, List, Tuple
from dataclasses import dataclass
from enum import Enum


class ProcessingStage(Enum):
    """Track which stage of processing we're at"""

    INIT = "initialization"
    PARSE = "parsing"
    MERGE = "merging"
    PROMPT = "prompt_creation"
    CATEGORIZE = "categorization"
    EXPORT = "export"
    COMPLETE = "complete"


@dataclass
class ProcessingStats:
    """Statistics for the processing run"""

    questions_parsed: int = 0
    answers_parsed: int = 0
    merged_count: int = 0
    unmatched_questions: List[int] = None
    unmatched_answers: List[int] = None
    categorized_count: int = 0

    def __post_init__(self):
        if self.unmatched_questions is None:
            self.unmatched_questions = []
        if self.unmatched_answers is None:
            self.unmatched_answers = []


class QuestionAnswerProcessor:
    """Modern Q&A preprocessing tool with progress tracking"""

    CATEGORIES = {
        1: "Biological Bases of Behavior",
        2: "Cognitive-Affective Bases of Behavior",
        3: "Social and Cultural Bases of Behavior",
        4: "Growth and Lifespan Development",
        5: "Assessment and Diagnosis",
        6: "Treatment, Intervention, Prevention, and Supervision",
        7: "Research Methods and Statistics",
        8: "Ethical/Legal/Professional Issues",
        9: "Industrial Organizational",
    }

    def __init__(
        self, naming_convention: str, sql_table_name: str, auto_run: bool = False
    ):
        """
        Initialize the processor

        Args:
            naming_convention: Base name for files (e.g., "Exam_1")
            sql_table_name: Name of SQL table for inserts
            auto_run: If True, runs without user prompts
        """
        print(f"\n{'='*70}")
        print(f"🚀 Q&A PREPROCESSING TOOL")
        print(f"{'='*70}")

        self.naming_convention = naming_convention
        self.sql_table_name = sql_table_name
        self.auto_run = auto_run
        self.stats = ProcessingStats()
        self.current_stage = ProcessingStage.INIT

        # Setup directories
        self.target_dir = Path(__file__).parent / "output"
        self.target_dir.mkdir(exist_ok=True)

        print(f"📁 Output directory: {self.target_dir}")

        # Define file paths
        self._setup_file_paths()

        # Store merged data
        self.merged_data = []

        print(f"✅ Initialization complete!\n")

    def _setup_file_paths(self):
        """Setup all file paths"""
        base = self.target_dir / self.naming_convention

        # Input files
        self.questions_file = base.with_suffix(".txt")
        self.answers_file = Path(str(base) + "_Answers.txt")

        # Output files
        self.categorization_json = Path(str(base) + "_Categorization.json")
        self.prompt_file = Path(str(base) + "_Categorization_Prompt.txt")
        self.categories_response_file = Path(str(base) + "_Categories_Response.json")
        self.final_json = Path(str(base) + "_Final.json")
        self.sql_file = Path(str(base) + "_Insert.sql")

        print(f"📝 Questions file: {self.questions_file.name}")
        print(f"📝 Answers file: {self.answers_file.name}")

    def _print_stage(self, stage: ProcessingStage, emoji: str = "⚙️"):
        """Print current processing stage"""
        self.current_stage = stage
        print(f"\n{emoji} STAGE: {stage.value.upper().replace('_', ' ')}")
        print(f"{'─'*70}")

    def _print_progress(self, message: str, emoji: str = "▶️"):
        """Print progress message"""
        print(f"{emoji} {message}")

    def _print_success(self, message: str):
        """Print success message"""
        print(f"✅ {message}")

    def _print_warning(self, message: str):
        """Print warning message"""
        print(f"⚠️  {message}")

    def _print_error(self, message: str):
        """Print error message"""
        print(f"❌ {message}")

    def _prompt_continue(self, message: str):
        """Prompt user to continue if not in auto mode"""
        if not self.auto_run:
            print(f"\n{'─'*70}")
            input(f"⏸️  {message}\n   Press ENTER to continue... ")
            print()

    @staticmethod
    def parse_questions(questions_text: str) -> List[Dict]:
        """Parse questions from text - handles multi-line choices"""
        questions = []

        # Split by question numbers, but be more careful about boundaries
        pattern = r"(\d+)\.\s+(.*?)(?=\n\d+\.\s+|$)"
        matches = re.findall(pattern, questions_text, re.DOTALL)

        for match in matches:
            q_num = match[0]
            q_content = match[1].strip()

            # Split content into lines
            lines = q_content.split("\n")
            question_text = lines[0].strip()

            choices = {"a": "", "b": "", "c": "", "d": ""}
            current_choice = None
            current_text = []

            for line in lines[1:]:
                # Remove excessive whitespace but keep the line
                line = line.strip()
                if not line:
                    continue

                # Check if this line starts a new choice (a., b., c., or d.)
                choice_match = re.match(r"^([a-d])\.\s+(.*)", line)

                if choice_match:
                    # Save previous choice if exists
                    if current_choice is not None:
                        choices[current_choice] = " ".join(current_text).strip()

                    # Start new choice
                    current_choice = choice_match.group(1)
                    current_text = [choice_match.group(2).strip()]
                else:
                    # This is a continuation of the current choice
                    if current_choice is not None:
                        current_text.append(line)

            # Save the last choice
            if current_choice is not None:
                choices[current_choice] = " ".join(current_text).strip()

            questions.append(
                {
                    "number": int(q_num),
                    "question_text": question_text,
                    "choice_a": choices["a"],
                    "choice_b": choices["b"],
                    "choice_c": choices["c"],
                    "choice_d": choices["d"],
                }
            )

        return questions

    @staticmethod
    def parse_answers(answers_text: str) -> List[Dict]:
        """Parse answers and explanations from text"""
        answers = []

        # First try the standard pattern with "--"
        pattern = r"(\d+)\.[\s\t]+([A-D])--\s*(.*?)(?=\n\d+\.[\s\t]|$)"
        matches = re.findall(pattern, answers_text, re.DOTALL | re.MULTILINE)

        # Track which question numbers we found
        found_numbers = set()

        for match in matches:
            a_num = int(match[0])
            correct = match[1].lower()
            explanation = match[2].strip()

            answers.append(
                {
                    "number": a_num,
                    "correct_answer": correct,
                    "explanation": explanation,
                }
            )
            found_numbers.add(a_num)

        # Now look for answers without "--" (just letter answers)
        # Pattern: number, period, whitespace/tab, letter A-D, end of line
        pattern_simple = r"(\d+)\.[\s\t]+([A-D])[\s\t]*$"
        simple_matches = re.findall(pattern_simple, answers_text, re.MULTILINE)

        for match in simple_matches:
            a_num = int(match[0])
            # Skip if we already found this answer with the full pattern
            if a_num in found_numbers:
                continue

            correct = match[1].lower()
            answers.append(
                {
                    "number": a_num,
                    "correct_answer": correct,
                    "explanation": "",  # No explanation provided
                }
            )

        # Sort by number
        answers.sort(key=lambda x: x["number"])

        return answers

    def merge_questions_answers(
        self, questions: List[Dict], answers: List[Dict]
    ) -> Tuple[List[Dict], List[int], List[int]]:
        """Merge questions with their answers"""
        self._print_progress("Merging questions with answers...", "🔄")

        merged = []
        questions_dict = {q["number"]: q for q in questions}
        answers_dict = {a["number"]: a for a in answers}
        all_numbers = set(questions_dict.keys()) | set(answers_dict.keys())

        unmatched_q = []
        unmatched_a = []

        for num in sorted(all_numbers):
            q = questions_dict.get(num)
            a = answers_dict.get(num)

            if q and a:
                merged_item = {
                    **q,
                    "correct_answer": a["correct_answer"],
                    "explanation": a["explanation"],
                    "category": None,
                    "is_active": True,
                }
                merged.append(merged_item)
            elif q and not a:
                unmatched_q.append(num)
            elif a and not q:
                unmatched_a.append(num)

        # Update stats
        self.stats.questions_parsed = len(questions)
        self.stats.answers_parsed = len(answers)
        self.stats.merged_count = len(merged)
        self.stats.unmatched_questions = unmatched_q
        self.stats.unmatched_answers = unmatched_a

        # Print statistics
        self._print_statistics()

        return merged, unmatched_q, unmatched_a

    def _print_statistics(self):
        """Print processing statistics"""
        print(f"\n{'='*70}")
        print(f"📊 PARSING STATISTICS")
        print(f"{'='*70}")
        print(f"📝 Questions parsed: {self.stats.questions_parsed}")
        print(f"✅ Answers parsed: {self.stats.answers_parsed}")
        print(f"🔗 Successfully merged: {self.stats.merged_count}")

        if self.stats.unmatched_questions:
            count = len(self.stats.unmatched_questions)
            preview = self.stats.unmatched_questions[:10]
            more = "..." if count > 10 else ""
            self._print_warning(f"Questions WITHOUT answers ({count}): {preview}{more}")

        if self.stats.unmatched_answers:
            count = len(self.stats.unmatched_answers)
            preview = self.stats.unmatched_answers[:10]
            more = "..." if count > 10 else ""
            self._print_warning(f"Answers WITHOUT questions ({count}): {preview}{more}")

        if self.stats.categorized_count > 0:
            print(f"🏷️  Categorized: {self.stats.categorized_count}")

        print(f"{'='*70}\n")

    def create_categorization_prompt(self, questions: List[Dict]) -> str:
        """Create AI categorization prompt"""
        self._print_progress("Creating categorization prompt...", "📝")

        prompt = (
            "Please categorize each question with the appropriate category number:\n\n"
        )
        prompt += "Categories:\n"
        for pk, name in self.CATEGORIES.items():
            prompt += f"{pk}. {name}\n"
        prompt += "\n" + "=" * 80 + "\n\n"

        for q in questions:
            prompt += f"Question {q['number']}:\n"
            prompt += f"{q['question_text']}\n"
            prompt += f"Answer: {q['correct_answer'].upper()}\n"
            explanation_preview = q["explanation"][:150]
            prompt += f"Explanation: {explanation_preview}{'...' if len(q['explanation']) > 150 else ''}\n\n"

        prompt += "\nPlease respond with ONLY a JSON array like:\n"
        prompt += '[{"number": 1, "category": 6}, {"number": 2, "category": 5}, ...]\n'

        return prompt

    def apply_categories(
        self, merged_data: List[Dict], category_assignments: List[Dict]
    ) -> List[Dict]:
        """Apply category assignments to merged data"""
        self._print_progress("Applying categories to questions...", "🏷️")

        categorized_count = 0
        for item in merged_data:
            assignment = next(
                (c for c in category_assignments if c["number"] == item["number"]), None
            )
            if assignment:
                item["category"] = assignment["category"]
                categorized_count += 1

        self.stats.categorized_count = categorized_count
        self._print_success(f"Applied categories to {categorized_count} questions")

        return merged_data

    def export_to_json(self, data: List[Dict], filename: Path):
        """Export data to JSON file"""
        self._print_progress(f"Exporting to {filename.name}...", "💾")

        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        self._print_success(f"Exported {len(data)} items to {filename.name}")

    def export_to_sql(self, data: List[Dict]):
        """Generate SQL INSERT statements"""
        self._print_progress(f"Generating SQL statements...", "🗄️")

        sql_count = 0
        with open(self.sql_file, "w", encoding="utf-8") as f:
            for item in data:
                if item["category"] is None:
                    continue

                sql_count += 1

                def escape_sql(text):
                    if text is None:
                        return ""
                    return text.replace("'", "''")

                sql = f"""INSERT OR IGNORE INTO {self.sql_table_name} (category_id, question_text, choice_a, choice_b, choice_c, choice_d, correct_answer, explanation, is_active, created_at, updated_at)
VALUES ({item['category']}, '{escape_sql(item['question_text'])}', '{escape_sql(item['choice_a'])}', '{escape_sql(item['choice_b'])}', '{escape_sql(item['choice_c'])}', '{escape_sql(item['choice_d'])}', '{item['correct_answer']}', '{escape_sql(item['explanation'])}', TRUE, datetime('now'), datetime('now'));

"""
                f.write(sql)

        self._print_success(
            f"Generated {sql_count} SQL statements in {self.sql_file.name}"
        )

    def step1_parse_and_merge(self):
        """Step 1: Parse questions and answers, then merge"""
        self._print_stage(ProcessingStage.PARSE, "📖")

        # Check if input files exist
        if not self.questions_file.exists():
            self._print_error(f"Questions file not found: {self.questions_file}")
            return False

        if not self.answers_file.exists():
            self._print_error(f"Answers file not found: {self.answers_file}")
            return False

        self._print_progress(f"Reading {self.questions_file.name}...", "📄")
        with open(self.questions_file, "r", encoding="utf-8") as f:
            questions_text = f.read()

        self._print_progress(f"Reading {self.answers_file.name}...", "📄")
        with open(self.answers_file, "r", encoding="utf-8") as f:
            answers_text = f.read()

        # Parse
        self._print_stage(ProcessingStage.PARSE, "🔍")
        self._print_progress("Parsing questions...", "📝")
        questions = self.parse_questions(questions_text)
        self._print_success(f"Parsed {len(questions)} questions")

        self._print_progress("Parsing answers...", "✍️")
        answers = self.parse_answers(answers_text)
        self._print_success(f"Parsed {len(answers)} answers")

        # Merge
        self._print_stage(ProcessingStage.MERGE, "🔗")
        self.merged_data, _, _ = self.merge_questions_answers(questions, answers)

        # Export for categorization
        self.export_to_json(self.merged_data, self.categorization_json)

        return True

    def step2_create_prompt(self):
        """Step 2: Create categorization prompt"""
        self._print_stage(ProcessingStage.PROMPT, "📝")

        if not self.merged_data:
            # Try to load from file
            if self.categorization_json.exists():
                self._print_progress("Loading merged data...", "📂")
                with open(self.categorization_json, "r") as f:
                    self.merged_data = json.load(f)
            else:
                self._print_error("No merged data found. Run step 1 first.")
                return False

        prompt = self.create_categorization_prompt(self.merged_data)

        with open(self.prompt_file, "w", encoding="utf-8") as f:
            f.write(prompt)

        self._print_success(f"Prompt saved to {self.prompt_file.name}")

        # Create empty categories response file
        if not self.categories_response_file.exists():
            with open(self.categories_response_file, "w", encoding="utf-8") as f:
                f.write("[]")
            self._print_success(
                f"Created empty response file: {self.categories_response_file.name}"
            )
        else:
            self._print_warning(
                f"Response file already exists: {self.categories_response_file.name}"
            )

        print(f"\n{'='*70}")
        print(f"🤖 NEXT STEPS:")
        print(f"{'='*70}")
        print(f"1. Copy the content from: {self.prompt_file}")
        print(f"2. Paste it to Claude (or another AI)")
        print(
            f"3. Save Claude's JSON response as: {self.categories_response_file.name}"
        )
        print(f"4. Place it in: {self.target_dir}")
        print(f"{'='*70}\n")

        return True

    def step3_apply_categories_and_export(self):
        """Step 3: Apply categories and export final files"""
        self._print_stage(ProcessingStage.CATEGORIZE, "🏷️")

        # Check if categories response exists
        if not self.categories_response_file.exists():
            self._print_error(
                f"Categories file not found: {self.categories_response_file.name}"
            )
            print(f"   Please create this file with Claude's response first.")
            return False

        # Load categories
        self._print_progress("Loading category assignments...", "📂")
        with open(self.categories_response_file, "r") as f:
            categories = json.load(f)

        self._print_success(f"Loaded {len(categories)} category assignments")

        # Load merged data if needed
        if not self.merged_data:
            with open(self.categorization_json, "r") as f:
                self.merged_data = json.load(f)

        # Apply categories
        self.merged_data = self.apply_categories(self.merged_data, categories)

        # Export
        self._print_stage(ProcessingStage.EXPORT, "💾")
        self.export_to_json(self.merged_data, self.final_json)
        self.export_to_sql(self.merged_data)

        self._print_statistics()

        return True

    def run(self):
        """Run the complete workflow"""
        try:
            # Step 1: Parse and merge
            self._prompt_continue("Ready to parse questions and answers?")
            if not self.step1_parse_and_merge():
                return

            # Step 2: Create prompt
            self._prompt_continue("Ready to create categorization prompt?")
            if not self.step2_create_prompt():
                return

            # Wait for user to categorize
            self._prompt_continue(
                f"Have you:\n"
                f"   1. Used the prompt from {self.prompt_file.name}\n"
                f"   2. Saved Claude's response as {self.categories_response_file.name}\n"
                f"   Ready to apply categories?"
            )

            # Step 3: Apply categories and export
            if not self.step3_apply_categories_and_export():
                return

            # Complete
            self._print_stage(ProcessingStage.COMPLETE, "🎉")
            print(f"\n{'='*70}")
            print(f"✨ PROCESSING COMPLETE!")
            print(f"{'='*70}")
            print(f"📁 Output files in: {self.target_dir}")
            print(f"   📄 Final JSON: {self.final_json.name}")
            print(f"   🗄️  SQL File: {self.sql_file.name}")
            print(f"{'='*70}\n")

        except KeyboardInterrupt:
            print(f"\n\n⚠️  Process interrupted by user")
        except Exception as e:
            self._print_error(f"An error occurred: {e}")
            raise


if __name__ == "__main__":
    # Create processor
    processor = QuestionAnswerProcessor(
        naming_convention="Exam_1",
        sql_table_name="api_question",
        auto_run=False,  # Set to True to skip prompts
    )

    # Run the workflow
    processor.run()
