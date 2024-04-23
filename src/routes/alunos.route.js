const { Router, query } = require("express")
const Aluno = require("../models/aluno") //importando do model Aluno
const { password } = require("../config/database.config")
const { sign } = require("jsonwebtoken")
const { auth } = require("../middleware/auth")
const alunosRoutes = new Router()


//Criando rota para cadastrar alunos 
alunosRoutes.post("/", async (req, res) => { //insert into 
    try {
     const { email, password, nome, data_nascimento, celular } = 
     req.body
     
     
 
     if(!nome){
         return res.status(400).json({messagem: 'O nome não foi inserido'})
     }
 
     if (!data_nascimento.match(/\d{4}-\d{2}-\d{2}/gm)){ //mascara para data no formato desejado
         return res.status(400).json({messagem: 'A data de nascimento não está no formato correto'})
     }
 
     if (!data_nascimento){
         return res.status(400).json({messagem: 'a data de nascimento é obrigatoria'})
     }
     
     const aluno = await Aluno.create({ //Se os nomes forem iguais as variaveis pode ser por aqui apenas   --const aluno = await Aluno.create(req.body)
         email:email,
         password, password,
         nome: nome,
         data_nascimento: data_nascimento,
         celular: celular
         
     })
     res.status(201).json({ aluno })
     
    } catch (error) {
         res.status(500).json({error: 'Não foi possível cadastrar o aluno'})
    }
 })
 
 //as que estão com auth na frente é que são privadas
 ////Criando rota para listar alunos
 alunosRoutes.get("/", auth, async (req, res) => {  //select * from alunos
 
     const alunos = await Aluno.findAll()
     res.json({alunos})
 })
 
 //rota put para atualizar aluno
 alunosRoutes.put('/:id', auth, async (req, res) => {
 
     try {
         const id = req.params.id
         const aluno = await Aluno.findByPk(id)
     
         if(!id) {
             return res.status(404).json({mensagem: 'Aluno não encontrado'})
         }
         
         aluno.update(req.body)
         await aluno.save()
         res.json(aluno)
         
         
         
     } catch (error) {
         res.status(400).json({mensagem: 'Não foi possível atualizar o aluno'})
         
     }
 })
 
 alunosRoutes.delete('/:id',auth,  async (req, res)=>{
     const id = req.params.id
     try {
         await Aluno.destroy({
             where:{
                 id
             }
         })
         return res.status(204).json({})
         
     } catch (error) {
         
         if(!id){
             return res.status(404).json({errormessage})
         }
     }
     
 
 
 
 
 })

 module.exports = alunosRoutes
 