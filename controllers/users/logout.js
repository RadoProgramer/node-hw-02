const logout = async (req, res) => {
    const user = req.user;
    user.token = null;
    await user.save();
    res.status(204).send();
  };
  
  module.exports = logout;
  