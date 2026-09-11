import os
from flask import Flask, render_template, request, jsonify
from flask_mail import Mail, Message

app = Flask(__name__)

# Flask-Mail SMTP Configuration for Gmail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'streamstore90@gmail.com'
# Set MAIL_PASSWORD in environment or replace 'your_app_password_here' with your Google App Password
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your_app_password_here')
app.config['MAIL_DEFAULT_SENDER'] = 'streamstore90@gmail.com'

mail = Mail(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/send-verification-email', methods=['POST'])
def send_verification_email():
    try:
        data = request.form
        service = data.get('service', 'N/A')
        plan = data.get('plan', 'N/A')
        country = data.get('country', 'N/A')
        file = request.files.get('screenshot')

        msg = Message(
            subject=f"🚨 New Payment Submitted — {service} ({plan})",
            recipients=['streamstore90@gmail.com']
        )

        msg.body = f"""
        A new payment proof screenshot has been submitted!

        -------------------------------------------
        Order Details:
        • Service: {service}
        • Plan: {plan}
        • Country: {country}
        -------------------------------------------

        Please review the attached screenshot and confirm account setup over Instagram DM.
        """

        if file:
            msg.attach(
                filename=file.filename,
                content_type=file.content_type,
                data=file.read()
            )

        mail.send(msg)
        return jsonify({'status': 'success', 'message': 'Verification email sent successfully.'}), 200

    except Exception as e:
        print("Email sending error:", e)
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)