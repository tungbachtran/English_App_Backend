const exerciseRoutes = require("./exercise.route");


module.exports = (app) => {
    
    
    app.use("/exercises", exerciseRoutes);
    
}