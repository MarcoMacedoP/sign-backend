//Dependencies and resources
const express = require("express");
const router = express.Router();
const debug = require("debug")("app:api:providers-expenses");
//services
const ExpensesServices = require("../../services/providers/expenses");
//utils
const {sendGoodResponse} = require("../../utils/responses");

//Routes-----------------------------------------------------------------------------
router.get("/:providerId", async (req, res, next) => {
  //get all
  const {providerId} = req.params;
  const expensesServices = new ExpensesServices();
  try {
    const expenses = await expensesServices.getAll({
      providerId
    });
    sendGoodResponse({
      response: res,
      message: "fetched incomes",
      statusCode: 200,
      data: expenses
    });
  } catch (error) {
    next(error);
  }
});
router.post("/", async (req, res, next) => {
  //Add expense
  const expensesServices = new ExpensesServices();
  try {
    const expense = await expensesServices.createOne(req.body);
    sendGoodResponse({
      response: res,
      message: "created income",
      statusCode: 200,
      data: expense
    });
  } catch (error) {
    next(error);
  }
});
router.get("/:expenseId", async (req, res, next) => {
  //get one product by it's id
  const {expenseId} = req.params;
  const expensesServices = new ExpensesServices();

  try {
    const expense = await expensesServices.getOneById(expenseId);
    debug(expense);
    sendGoodResponse({
      response: res,
      message: "created income",
      statusCode: 200,
      data: expense
    });
  } catch (error) {
    next(error);
  }
});
router.patch("/:productId", async (req, res, next) => {
  //update expense
  const {productId} = req.params;
  const expensesServices = new ExpensesServices();

  try {
    const updatedExpense = await expensesServices.updateOne(
      req.body,
      productId
    );
    sendGoodResponse({
      response: res,
      message: "created income",
      statusCode: 200,
      data: updatedExpense
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/:expenseId", async (req, res, next) => {
  //remove service by is id
  const {expenseId} = req.params;
  const expensesServices = new ExpensesServices();

  try {
    await expensesServices.removeOne(expenseId);
    sendGoodResponse({
      response: res,
      message: "deleted income",
      statusCode: 200,
      data: {removedId: expenseId}
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
