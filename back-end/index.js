import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js"
import usersRoutes from "./routes/users.js"

const EMPLOYEE_DOMAIN = process.env.EMPLOYEE_DOMAIN;
const ADMIN_DOMAIN = process.env.ADMIN_DOMAIN;
const PORT = Number(process.env.PORT);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
	origin: [EMPLOYEE_DOMAIN, ADMIN_DOMAIN],
	credentials: true // Allow cookie to be used
}));
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
	console.log(new Date());
	console.log(`Server is listening on port ${PORT}`);
});
