const { Router } = require("express")
const Aluno = require("../models/aluno") //importando do model Aluno
const Curso = require("../models/curso")
const Professor = require("../models/Professor")
const { error } = require("console")
const { where } = require("sequelize")

const routes = new Router()

                                    //--------------------ROTA PROFESSOR-----------------
//Criando rota para criar cursos Ex: 1
routes.post("/cursos", async (req, res) => {
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
// routes.get('/cursos', async(req, res) =>{
//     const nome = req.params  

//    const cursos = await Curso.findAll()
    
//     res.json(cursos)
// })

//listar por id especifico
// routes.get('/cursos/:id', async(req, res) => {
//     try {
//         const { id } = req.params
//         const curso = await Curso.findByPk(id)

//         if(!curso){
//             return res.status(404).json({mensagem: 'curso não encontrado'})
//         }

//         res.json(curso)

        
//     } catch (error) {
//         res.status(500).json({messagem: 'não foi possível lista o curso específico'})
        
//     }
// })
//rota get para lista cursos pelo nome POR QUERY PARAMS EX: 3
// routes.get('/cursos', async(req, res) =>{
//     const nome = req.query.nome || ''   //pega pelo nome ou deixa vazio
//Dai uso lá no query params no postman

//    const cursos = await Curso.findAll({ //senão mostra todos
//         where: {
//             nome: nome
//         }
//     })

//     res.json(cursos)
// })

//OU DA FORMA ABAIXO DÁ O MESMO RESULTADO

routes.get('/cursos', async (req, res)=> {
    try {
        let params = {}
    
        if(req.query.nome) {
            params = {...params, nome:req.query.nome}
        }
    
        const cursos = await Curso.findAll({
            where: params
            
        })
    
        res.json({cursos})
        
    } catch (error) {
        res.status(500).json({error: 'Não é possível listar o curso'})
    }

})






//End point para atualizar o curso EX:4
routes.put('/cursos/:id', async (req, res) => {

    try {
        const id = req.params.id
        const curso = await Curso.findByPk(id)
    
        if(!id) {
            return res.status(404).json({mensagem: 'Id do Curso não encontrado'})
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
routes.delete('/cursos/:id', async(req, res) =>{
    
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


                                    //----------------------ROTA ALUNOS-------------------
//Criando rota para cadastrar alunos 
routes.post("/alunos", async (req, res) => { //insert into 
   try {
    const { nome, data_nascimento, celular } = 
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
        nome: nome,
        data_nascimento: data_nascimento,
        celular: celular
    })
    res.status(201).json({ aluno })
    
   } catch (error) {
        res.status(500).json({error: 'Não foi possível cadastrar o aluno'})
   }
})

////Criando rota para listar todos os alunos
routes.get("/alunos", async (req, res) => {  //select * from alunos

    const alunos = await Aluno.findAll()
    res.json(alunos)
})

//listar aluno especifico
routes.get('/alunos/:id', async(req, res) => {
    try {
        const { id } = req.params
        const aluno = await Aluno.findByPk(id)

        if(!aluno){
            return res.status(404).json({mensagem: 'Aluno não encontrado'})
        }

        res.json(aluno)

        
    } catch (error) {
        res.status(500).json({messagem: 'não foi possível lista o aluno específico'})
        
    }
})

//rota put para atualizar aluno
routes.put('/aluno/:id', async (req, res) => {

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

routes.delete('/alunos/:id', async (req, res)=>{
    const id = req.params.id
    try {
        await Aluno.destroy({
            where:{
                id: id
            }
        })
        res.status(204).json({})
        
    } catch (error) {
        
        if(!id){
            return res.status(404).json(error.message)
        }
    }
})

                                    //--------------------ROTA PROFESSOR-----------------
//EX: 6
//rota criar professor
routes.post('/professores', async (req, res) =>{
    try {
        const { curso, celular, salario } = req.body
        const nome = req.body

        if(!nome) {
            return res.status(400).json({message: 'O Nome não foi inserido'})
        }
        if(!curso){
            return res.status(400).json({message: 'O Curso não foi inserido'})
        }
        if(!celular){
            return res.status(400).json({message: 'O Celular não foi inserido'})
        }
        if(!salario){
            return res.status(400).json({message: 'O Salário não foi inserido'})
        }

        const professor = await Professor.create(
            nome,
            curso,
            celular,
            salario
        )
        res.status(201).json({ professor })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Não foi possível cadastrar professor'})        
    }
})

//rota listar professor
routes.get('/professores', async(req, res) =>{
    try {
        let params = {}

        if(req.query.id){
            params = {...params, id:req.query.id}
        }
        if(req.query.nome){
            params = {...params, nome: req.query.nome}
        }

        const professores = await Professor.findAll({
            where: params
        })
        res.json({professores})
    } catch (error) {
        res.status(500).json({error: 'Não foi possível listar professores'})
    }


})

//Atualizar por id (route params)
routes.put('/professor/:id', async(req, res) =>{
    try {
        const id = req.params.id
        const professor = await Professor.findByPk(id)

        if(!id){
            return res.status(404).json({message: 'Professor não encontrado'})
        }

        professor.update(req.body)
        await professor.save()
        res.json(professor)
    } catch (error) {
        res.status(500).json({message: 'Não foi possível atualizar professor'})
    }
})

//Deletar por id (route params)
routes.delete('/professor/:id', async (req, res)=>{
    const id = req.params.id
    try {
        await Professor.destroy({
            where:{
                id: id
            }
        })
        res.status(204).json({})
        
    } catch (error) {
        
        if(!id){
            return res.status(404).json(error.message)
        }
    }
})


module.exports = routes