const Invoice = require('../controllers/invoice');
const { checkToken } = require('../middlewares/common');


const invoiceRouter=require('express').Router();


invoiceRouter.get('/bill/:id',Invoice.getInvoiceBill);

invoiceRouter.use(checkToken);

invoiceRouter.post('/search',Invoice.fetch);

invoiceRouter.post('/',Invoice.create);
invoiceRouter.get('/download',Invoice.download);
invoiceRouter.get('/:id',Invoice.view);
invoiceRouter.put('/:id',Invoice.edit);
invoiceRouter.delete('/:id',Invoice.delete);



module.exports=invoiceRouter;