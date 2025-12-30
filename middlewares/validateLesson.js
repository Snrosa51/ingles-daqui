const { body } = require('express-validator');

exports.validateLesson = [
  body('title').notEmpty().withMessage('Título obrigatório'),
  body('level').notEmpty().withMessage('Nível obrigatório'),
  body('description').isLength({ min: 10 }).withMessage('Descrição muito curta')
];
