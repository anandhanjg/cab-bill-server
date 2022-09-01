const userRouter=require('express').Router();
const User=require('../controllers/user');
const { checkToken } = require('../middlewares/common');


userRouter.post('/login',User.login);
userRouter.post('/register',User.addUser);

userRouter.use(checkToken);
userRouter.get('/profile',User.profile);
userRouter.put('/profile',User.updateProfile);
userRouter.get('/fetch',User.getUsers);

userRouter.get('/:username',User.getUser);
userRouter.put('/:username',User.updateUser);
userRouter.delete('/:username',User.deleteUser);




module.exports=userRouter;