FROM python:3.14.1-alpine AS builder

LABEL maintainer='ahmed'

COPY ./ /smart_exam_simulator

RUN apk update \
    && apk upgrade \
    && python3 -m venv /py \
    && /py/bin/pip install --upgrade pip \
    && /py/bin/pip install --no-cache --no-cache-dir -r /smart_exam_simulator/requirements.txt  \
    && chmod -R 777 /smart_exam_simulator \
    && rm -rf /var/cache/apk/* 


FROM python:3.14.1-alpine

LABEL maintainer="ahmed" \
      description="Smart Exam Simulator - Django Backend" \
      version="1.0"

ENV PYTHONUNBUFFERED 1 \
    PYTHONDONTWRITEBYTECODE 1



WORKDIR /smart_exam_simulator

COPY --from=builder /smart_exam_simulator /smart_exam_simulator
COPY --from=builder /py /py

ENV PATH="/smart_exam_simulator/scripts:/py/bin:$PATH"

CMD ["./scripts/py_run.sh"]