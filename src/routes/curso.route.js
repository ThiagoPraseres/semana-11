const { Router, query } = require("express")
const Curso = require("../models/curso") //importando do model curso
const { error } = require("console")
const { where } = require("sequelize")
const { sign } = require("jsonwebtoken")
const { auth } = require("../middleware/auth")

const cursoRoutes = new Router()



//Criando rota para criar cursos Ex: 1
cursoRoutes.post("/", async (req, res) => {
    try {
        const nome = req.body.nome
        const duracao_horas = req.body.duracao_horas


        if(!nome){
            return res.status(400).json({messagem: 'Não é possível cadastar cursos'})
        }
        
        if(!duracao_horas || !(duracao_horas >= 40 && duracao_horas <= 200)){
            return res.status(400).json({mensagem: 'Necessário inserir horas'})
        }
        
        const curso = await Curso.create({
        nome: nome,
        duracao_horas: duracao_horas
    })
    
    res.status(201).json({ curso })

        
    } catch (error) {
        res.status(400).json({error: 'não foi possível cadastrar o curso'})
    }
})

//Criando rota para listar todos cursos EX: 2
cursoRoutes.get('/', async(req, res) =>{
    const nome = req.params  

   const cursos = await Curso.findAll()
    
    res.json(cursos)
})

//rota get para lista cursos pelo nome EX: 3
cursoRoutes.get('/', async(req, res) =>{
    const nome = req.query.nome || ''   //Dai uso lá no query params no postman

   const cursos = await Curso.findAll({
        where: {
            nome: nome
        }
    })

    res.json(cursos)
})




//End point para atualizar o curso EX:4
cursoRoutes.put('/:id', async (req, res) => {

    try {
        const id = req.params.id
        const curso = await Curso.findByPk(id)
    
        if(!id) {
            return res.status(404).json({mensagem: 'Curso não encontrado'})
        }
        
        curso.update(req.body)
        await curso.save()
        res.json(curso)
        
        
        
    } catch (error) {
        res.status(400).json({mensagem: 'Não foi possível atualizar o curso'})
        
    }
})

//BODY PARAMS= post e put
//ROUTE PARAMS = put e delete
//QUERY PARAMS=get
//rota de deleção de curso EX:5 
cursoRoutes.delete('/:id', async(req, res) =>{
    
    const id = req.params.id //DELETE FROM CURSOS WHERE ID=X
    try {
        await Curso.destroy({
            where:{
                id
            }
        })
    
        return res.status(204).json({messagem: 'deleted'})
        
    } catch (error) {
        if (!id){
            return res.status(404).json({error:"Id do curso não encontrado"})
        }
        
    }
})



module.exports = cursoRoutes