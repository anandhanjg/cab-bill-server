const Travel = require('../controllers/travel');
const { checkToken } = require('../middlewares/common');
const travelRouter=require('express').Router();



travelRouter.use(checkToken);

travelRouter.get('/',Travel.fetch);
travelRouter.post('/',Travel.add);
travelRouter.get('/:id',Travel.view);
travelRouter.put('/:id',Travel.update);
travelRouter.delete('/:id',Travel.delete);


module.exports=travelRouter;