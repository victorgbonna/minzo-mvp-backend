const adminRoutes = require("./admin");
const authRoutes = require("./auth");
const businessRoutes=require("./business");
const userRoutes = require("./user");

module.exports = function routes(app) {
     console.log("API HIT");
    app.use('/hello', (req, res) => res.send('I am alive'));
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/business", businessRoutes);
    app.use("/api/v1/users", userRoutes);
    app.use("/api/v1/admin", adminRoutes);


    app.use((req, res, next) => {
        const error= new Error("Not Found");
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, next) => {
        res.status(error.status || 400);
        res.json({
            error: {
                status: error.status || 400,
                message: error.message,
           
            },
        });
    });
}
