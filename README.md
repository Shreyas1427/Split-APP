# 🧾 Split App

A full-stack expense splitting web app inspired by Splitwise. Easily track shared expenses, settle balances, and visualize analytics like monthly summaries and top categories.

---

## 📦 Tech Stack

- **Frontend:** React (CRA), Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Deployment:** Render.com (Frontend & Backend)

---

## 🚀 Live Demo

- **Frontend:** [https://split-app-frontend.onrender.com](https://split-app-1.onrender.com/)
- **Backend API:** [https://split-app-backend.onrender.com](https://split-app-i4rr.onrender.com)

---

## 📂 Project Structure

```
/split-app/
├── split-app-frontend/     # React App
└── split-app-backend/      # Express API
```

---

## 🧑‍💻 Local Development Setup

### 1. Clone the Repos

```bash
git clone https://github.com/your-username/split-app-backend.git
git clone https://github.com/your-username/split-app-frontend.git
```

---

### 2. Backend Setup

```bash
cd split-app-backend
npm install

# Create .env file:
echo "MONGO_URI=<your_mongodb_uri>\nPORT=3000" > .env

npm start
```

Test: [http://localhost:3000/api/v1/expenses/list](http://localhost:3000/api/v1/expenses/list)

---

### 3. Frontend Setup

```bash
cd ../split-app-frontend
npm install

# If using Vite:
echo "VITE_API_URL=http://localhost:3000" > .env

npm run dev  # or npm start for CRA
```

Visit: [http://localhost:3000](http://localhost:3000)

---


### 📬 Postman Collection

Test the live API via [this Postman collection](https://gist.github.com/Shreyas1427/b94b798c1222d85264168e12d13172ef)

You can import it into Postman or run requests via [Postman Web](https://web.postman.co).



## 🧠 Features

### 📋 Core Functionality
- Add, list, update, delete expenses
- Equal, percentage, or exact splits
- Auto balance calculation & settlements

### 📊 Analytics Dashboard
- Monthly spending summaries
- Individual vs group spending
- Top transactions & category totals

---

## 📬 API Documentation

| Method | Endpoint                           | Description              |
|--------|------------------------------------|--------------------------|
| GET    | `/api/v1/expenses/list`           | List all expenses        |
| POST   | `/api/v1/expenses/create`         | Add new expense          |
| PUT    | `/api/v1/expenses/update/:id`     | Update expense by ID     |
| DELETE | `/api/v1/expenses/remove/:id`     | Delete expense by ID     |
| GET    | `/api/v1/analytics/monthly-summary`     | Monthly totals     |
| GET    | `/api/v1/analytics/individual-vs-group` | Group vs individual |
| GET    | `/api/v1/analytics/top-expenses`        | Top expenses & categories |

---

## 🧾 Settlement Calculation Logic

The app calculates balances based on how much each user paid vs how much they owe:

1. **Equal Split**:
   - The expense is divided equally among all `shared_with` users.
   - The `paid_by` user is credited the full amount.

2. **Percentage Split**:
   - Each person’s share is calculated using the `split_values` object containing percentages.
   - Must sum to 100%.

3. **Exact Split**:
   - `split_values` contains exact amounts per person.
   - Must sum to the total expense.

Balances are aggregated and debts are simplified:
- Users with positive balances are creditors.
- Users with negative balances are debtors.
- Debtors are matched to creditors in order of amount to minimize total transactions.

---

## 🗃️ Database Schema (MongoDB)

### Collection: `expenses`
```json
{
  "amount": Number,
  "description": String,
  "category": String,
  "paid_by": String,
  "shared_with": [String],
  "split_type": "equal" | "percentage" | "exact",
  "split_values": { person: Number },
  "createdAt": Date,
  "updatedAt": Date
}
```

---

## ⚠️ Known Limitations / Assumptions

- No user authentication yet (anyone can submit names)
- `split_type` assumes valid data format; no strict schema enforcement on frontend
- Settlement logic minimizes transactions but doesn't optimize for fairness
- Categories are optional and not validated against a fixed set
- Real-time updates are not yet supported

---
## ✨ Contributions

- Clean, commented code
- Modular file structure
- Easily extendable with auth, notifications, or mobile view

PRs welcome! 💬

---

## 📄 License

[MIT](LICENSE)
