from flask import Flask, jsonify, Response, request
from flask_cors import CORS
from dotenv import load_dotenv
import boto3
import os
import re
import requests
from botocore.exceptions import NoCredentialsError, ClientError
from groq import Groq

load_dotenv()  # Load .env

app = Flask(__name__)
CORS(app)

# AWS Setup
s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name=os.environ.get("AWS_REGION")
)

# S3 Buckets
SUBJECT_BUCKETS = {
    'BEE': 'b-e-e',
    'PPS-1': 'pps-1',
    'Maths-1': 'maths-1',
    'Applied-Physics': 'applied-physics',
    'Maths-2': 'maths-2',
    'English': 'english-1.2',
    'Chemistry': 'chemistry-1.2',
    'PPS-2': 'pps-2',
    'Data-Structures': 'data-structures',
    'Digital-Logic-Design': 'digital-logic-design',
    'Discrete-Maths': 'discrete-maths',
    'Probability-Statistics': 'probability-statistics',
    'Python': 'python-2.1',
    'Computer-Organisation': 'computer-organisation',
    'FLAT': 'flat-2.2',
    'Software-Engineering': 'software-engineering-2.2',
    'DBMS': 'dbms-2.2',
    'OOP': 'oop-2.2',
}

# Common function
def list_files(bucket):
    try:
        response = s3.list_objects_v2(Bucket=bucket)
        files = []
        for obj in response.get('Contents', []):
            key = obj['Key']
            if key.lower().endswith(('.pdf', '.docx', '.ppt', '.pptx')):
                files.append(f"https://s3.{os.environ.get('AWS_REGION')}.amazonaws.com/{bucket}/{key}")
        return jsonify(files)
    except NoCredentialsError:
        return jsonify({"error": "Missing AWS credentials"}), 403
    except ClientError as e:
        return jsonify({"error": str(e)}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Dynamic routes per bucket
@app.route('/list-pdfs')
def list_bee(): return list_files('b-e-e')

@app.route('/list-pps1-pdfs')
def list_pps1(): return list_files('pps-1')

@app.route('/list-maths1-files')
def list_maths1(): return list_files('maths-1')

@app.route('/list-ds-pdfs')
def list_ds(): return list_files('data-structures')

@app.route('/list-dld-pdfs')
def list_dld(): return list_files('digital-logic-design')

@app.route('/list-dm-pdfs')
def list_dm(): return list_files('discrete-maths')

@app.route('/list-ps-pdfs')
def list_ps(): return list_files('probability-statistics')

@app.route('/list-python-pdfs')
def list_python(): return list_files('python-2.1')

@app.route('/list-english-pdfs')
def list_english(): return list_files('english-1.2')

@app.route('/list-pps2-files')
def list_pps2(): return list_files('pps-2')

@app.route('/list-maths2-files')
def list_maths2(): return list_files('maths-2')

@app.route('/list-chemistry-files')
def list_chemistry(): return list_files('chemistry-1.2')

@app.route('/list-co-files')
def list_co(): return list_files('computer-organisation')

@app.route('/list-flat-files')
def list_flat(): return list_files('flat-2.2')

@app.route('/list-se-files')
def list_se(): return list_files('software-engineering-2.2')

@app.route('/list-dbms-files')
def list_dbms(): return list_files('dbms-2.2')

@app.route('/list-oop-files')
def list_oop(): return list_files('oop-2.2')

@app.route('/list-applied-physics-files')
def list_applied_physics(): return list_files('applied-physics')

# Proxy PDF Viewer
@app.route('/proxy-pdf')
def proxy_pdf():
    url = request.args.get('url')
    if not url:
        return "Missing url", 400
    r = requests.get(url, stream=True)
    headers = {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline'
    }
    return Response(r.content, headers=headers)

# Upload file to subject bucket
@app.route('/upload_file', methods=['POST'])
def upload_file():
    subject = request.form.get("subject")
    file = request.files.get("file")
    file_name = request.form.get("fileName")

    if not subject or not file or not file_name:
        return jsonify({"error": "Subject, file, or file name missing!"}), 400

    bucket = SUBJECT_BUCKETS.get(subject)
    if not bucket:
        return jsonify({"error": f"Unknown subject: {subject}"}), 400

    ext = file.filename.rsplit('.', 1)[-1].lower()
    if ext not in ["pdf", "docx", "ppt", "pptx"]:
        return jsonify({"error": "Invalid file type!"}), 400

    if file_name.lower().endswith(f'.{ext}'):
        file_name = file_name[:-(len(ext)+1)]
    file_name = re.sub(r'[^a-zA-Z0-9 _\-]', '', file_name).strip()
    if not file_name:
        return jsonify({"error": "Invalid file name!"}), 400

    filename = f"{file_name}.{ext}"
    s3.upload_fileobj(file, bucket, filename)
    url = f"https://s3.{os.environ.get('AWS_REGION')}.amazonaws.com/{bucket}/{filename}"
    return jsonify({"subject": subject, "uploaded": url, "fileName": filename}), 200

# Chat with Groq API
@app.route('/chat-groq', methods=['POST'])
def chat_groq():
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{"role": "user", "content": user_message}]
        )
        reply = completion.choices[0].message.content
        return jsonify({'reply': reply})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run app
if __name__ == '__main__':
    app.run(debug=True)
