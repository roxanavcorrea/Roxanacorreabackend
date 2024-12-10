export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: `Acceso denegado. Solo para ${role}s.` });
        }
        next();
    };
};
