const exerciseRoutes = require("./exericse/exercise.route");
const progressRoutes = require("./progress/progress.route");

module.exports = (app) => {
    
    
    app.use("/exercises", exerciseRoutes);
    app.use("/progress", progressRoutes);
}