# Taleem Umerkot

> **Tagline:** Every child deserves an opportunity to learn.

An AI-powered education platform built for the children of **Umerkot, Sindh, Pakistan**. تعليم اُميرڪوٹ

---

## 🌍 The Problem

Children in Umerkot face some of the toughest education challenges in Pakistan:

- 🏫 Schools without electricity, water, or washrooms
- 👩‍🏫 Severe shortage of qualified teachers
- 📚 Low literacy and basic math skills
- 👧 Girls dropping out due to cultural and economic pressures
- 📱 Limited access to digital learning tools

## ✨ The Solution

Taleem Umerkot is an AI-powered platform that connects **students**, **volunteer teachers**, and **citizens** through three simple features:

### 📚 1. AI Learning Assistant

Students pick a subject (Math, Urdu, or Sindhi) and a level (Beginner or Intermediate). The AI generates 3 personalized multiple-choice questions in their language. After submitting, they see their score with check marks for correct answers and crosses for wrong ones — so they learn from mistakes immediately.

### 🤝 2. Volunteer Teacher Connection

Anyone can register as a volunteer teacher by providing their name, subject, phone number, and preferred mode (online or in-person). The list of available volunteers is public — families can tap the phone number to call them directly. No apps, no logins, just a phone call away from free education.

### 🚩 3. School Problem Reporting

Citizens can report problems at any school in Umerkot — no electricity, no clean water, no washrooms, shortage of teachers, building needs repair, no furniture, or other issues. Each report appears in a public dashboard with a status badge: **pending**, **in-progress**, or **resolved**. This creates accountability that didn't exist before.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui |
| **Database** | Prisma ORM + SQLite |
| **AI** | Z.ai SDK (`z-ai-web-dev-sdk`) — GLM model |
| **Icons** | Lucide React |
| **Runtime** | Node.js 18+ |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** — download from https://nodejs.org
- **npm** (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Devkumar2324/taleem-umerkot.git
cd taleem-umerkot

# 2. Install dependencies
npm install

# 3. Create a .env file in the project root
#    Add this line:
#    DATABASE_URL="file:./db/custom.db"

# 4. Set up the database
npx prisma db push

# 5. Start the development server
npm run dev
# (On Windows, if you get a 'tee' error, run: npx next dev -p 3000)

# 6. Open your browser
#    http://localhost:3000
```

---

## 📁 Project Structure

```
taleem-umerkot/
├── prisma/
│   └── schema.prisma              # Database models (Volunteer, SchoolReport)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── quiz/route.ts          # AI quiz generation endpoint
│   │   │   ├── volunteers/route.ts    # Volunteer GET + POST API
│   │   │   └── reports/route.ts       # School report GET + POST API
│   │   ├── globals.css            # Theme colors (warm terracotta)
│   │   ├── layout.tsx             # Page metadata
│   │   └── page.tsx               # Main page (hero + 3 tabs)
│   ├── components/
│   │   ├── features/
│   │   │   ├── learn-tab.tsx      # AI Quiz UI component
│   │   │   ├── volunteer-tab.tsx  # Volunteer form + list
│   │   │   └── report-tab.tsx     # Report form + list
│   │   └── ui/                    # shadcn/ui components
│   └── lib/
│       ├── db.ts                  # Prisma database client
│       └── utils.ts               # Helper functions
├── public/                        # Static assets
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 🎯 Key Features Deep Dive

### AI Quiz Generation

The `/api/quiz` endpoint uses the **Z.ai SDK** to call the GLM language model. The AI receives:

- A subject (Math, Urdu, or Sindhi)
- A difficulty level (Beginner or Intermediate)

And returns 3 multiple-choice questions as JSON:

```json
{
  "questions": [
    {
      "question": "What is 2 + 3?",
      "options": ["3", "4", "5", "6"],
      "answerIndex": 2
    }
  ]
}
```

The frontend renders this as an interactive quiz, tracks the student's answers, and shows a final score with visual feedback (green for correct, red for wrong).

### Volunteer Teacher Network

The `Volunteer` model stores:

- `name` — full name of the volunteer
- `subject` — what they teach (Math, Urdu, Sindhi, English, Science)
- `phone` — contact number (displayed as a clickable `tel:` link)
- `mode` — online or in-person

Citizens can browse the list and call any volunteer directly — no platform lock-in.

### School Problem Reporting

The `SchoolReport` model stores:

- `schoolName` — name of the school
- `problem` — type of issue (electricity, water, washroom, teachers, etc.)
- `details` — full description from the reporter
- `status` — pending, in-progress, or resolved
- `createdAt` — timestamp

This creates a public record of school problems that NGOs and authorities can use to prioritize interventions.

---

## 🎨 Design Choices

- **Warm color palette** — terracotta and amber tones inspired by the Sindh desert, instead of generic tech-blue
- **Mobile-first responsive design** — works on low-end phones, the actual devices used by students in Umerkot
- **Bilingual touches** — Urdu title (تعليم اُميرڪوٹ) in header and footer
- **Beginner-friendly code** — every file starts with a comment block explaining what it does, in plain English
- **Simple architecture** — only 3 API routes, 3 feature components, 2 database models. Easy to read top-to-bottom.

---

## 🌱 What's Next

This MVP is just the beginning. After the hackathon, we plan to:

- **Partner with one real school in Umerkot** and test the platform with 10 students
- **Interview teachers, parents, and students** to identify the most urgent educational problems
- **Add offline support** using service workers so content works without continuous internet
- **Share verified school reports** with relevant NGOs and Sindh education authorities
- **Measure real impact** — attendance improvements, literacy scores, number of resolved reports

---

## 📜 License

This project is open-source and available under the **MIT License**.

---

## 💛 Acknowledgments

- Inspired by **"The Malala of Umerkot"** — a young girl from this region who fought for her right to study
- Built with the [Z.ai SDK](https://z.ai) for AI-powered learning
- UI components from [shadcn/ui](https://ui.shadcn.com)

> _"One child, one teacher, one book, one pen can change the world." — Malala Yousafzai_

---

**Built with 💛 for the children of Umerkot, Sindh.**
