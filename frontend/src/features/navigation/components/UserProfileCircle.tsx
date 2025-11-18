import GradientText from "../../../components/ui/GradientText";
import profilePic from "../../../assets/profile.jpg";

export default function UserProfileCircle() {
  return (
    <div className="ml-auto lg:ml-10 flex items-center gap-3">
      <div className="relative w-12 h-12 rounded-full bg-linear-to-br from-indigo-600 to-purple-600 p-0.5 hover:scale-105 transition-transform duration-200">
        <div className="w-full h-full rounded-full bg-white p-0.5">
          <img
            src={profilePic}
            alt="profile"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      <GradientText text={import.meta.env.VITE_USER_NAME} />
    </div>
  );
}
