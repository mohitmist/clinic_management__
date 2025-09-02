# ClinicFlow 🏥

ClinicFlow is a **Clinic Management System** built with **Next.js + Tailwind CSS + Firebase**.  
It streamlines clinic operations such as user authentication, role-based login (Doctor, Receptionist, Admin), and patient management.

---

## 🚀 Features
- Secure login with role-based access (Doctor, Receptionist, Admin).
- Modern UI built with **Next.js** and **Tailwind CSS**.
- Firebase integration:
  - Authentication
  - Firestore Database
  - Cloud Functions
  - Hosting
- Responsive and mobile-friendly design.

---

## 📂 Project Structure
clinicflow/
├── public/ # Static assets (icons, images)
├── src/ # Main application source code
│ ├── components/ # Reusable UI components
│ ├── pages/ # Next.js pages (login, dashboard, etc.)
│ ├── styles/ # Tailwind / custom CSS
│ └── utils/ # Firebase config & helpers
├── .firebaserc # Firebase project settings
├── firebase.json # Firebase Hosting & Functions config
├── package.json # Node.js dependencies
├── tailwind.config.ts # Tailwind CSS config
├── next.config.ts # Next.js config
└── README.md # Project documentation



---

## ⚙️ Workflow & Execution

### 1️⃣ Clone the project
If you connected Firebase Studio to GitHub:
```bash
git clone https://github.com/<your-username>/clinicflow.git
cd clinicflow
2️⃣ Install dependencies

npm install
3️⃣ Run locally

npm run dev
Now open http://localhost:3000 to view the app locally.

4️⃣ Firebase Setup
Make sure you are logged into Firebase:


firebase login
Initialize Firebase (only once, already done if firebase.json exists):


firebase init
5️⃣ Deploy to Firebase Hosting
Build the Next.js app:


npm run build
Export and deploy:


firebase deploy --only hosting
Your app will be live at:


https://<your-project-id>.web.app
🔄 GitHub Workflow (CI/CD)
This project supports automatic deployment via GitHub Actions:

Every push to the main branch will trigger Firebase Hosting deployment.

The workflow is defined in .github/workflows/firebase-hosting.yml.

Steps:

Push code to GitHub:


git add .
git commit -m "Updated ClinicFlow"
git push origin main
GitHub Action will:

Build the Next.js app

Deploy automatically to Firebase Hosting

📌 Requirements
Node.js v16+

npm or yarn

Firebase CLI installed:

npm install -g firebase-tools

🧑‍💻 Contributors

Mohit Kumhar – Developer

This README is clean, professional, and explains the full **workflow + execution + GitHub workflow** for your ClinicFlow project.  


