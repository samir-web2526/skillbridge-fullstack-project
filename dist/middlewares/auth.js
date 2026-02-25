import { auth as betterAuth } from "../lib/auth";
export var userRole;
(function (userRole) {
    userRole["STUDENT"] = "STUDENT";
    userRole["TUTOR"] = "TUTOR";
    userRole["ADMIN"] = "ADMIN";
})(userRole || (userRole = {}));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers,
            });
            console.log(session?.user);
            if (!session) {
                return res.status(401).json({
                    success: false,
                    message: "You are unauthorized!!!",
                });
            }
            if (!session?.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Plz verify your email",
                });
            }
            req.user = {
                id: session?.user.id,
                name: session?.user.name,
                email: session?.user.email,
                role: session?.user.role,
                emailVerify: session?.user.emailVerified,
            };
            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "you don't have permission to acces this part"
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default auth;
//# sourceMappingURL=auth.js.map