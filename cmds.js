
const model = require('./model');
const {colorize, log, biglog, errorlog} = require("./out");


exports.helpCmd = rl => {
      log("Comandos:");
      log("  h|help - Muestra esta ayuda.");
      log("  list - Listar los quizzes existentes.");
      log("  show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
      log("  add - Añadir un nuevo quiz");
      log("  delete <id> - Borra el quiz indicado");
      log("  edit <id> - Edita el quiz indicado");
      log("  test <id> - Probar el quiz indicado");
      log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
      log("  credits - Créditos.");
      log("  q|quit - Salir del programa.");
      rl.prompt();
};

exports.listCmd = rl => {
      model.getAll().forEach((quiz, id) => {
        log(` [${colorize(id, "blue")}]: ${quiz.question} `);
      });
      rl.prompt();
};


exports.showCmd = (rl, id) => {
     if (typeof id === "undefined"){
       errorlog(`Falta el parámetro id.`);
     } else{
       try{
         const quiz = model.getByIndex(id);
         log(`[${colorize(id, 'blue')}]: ${quiz.question} ${colorize('=>' , 'blue')} ${quiz.answer}`);
       } catch(error) {
         errorlog(error.message);
       }
     }
     rl.prompt();
};

exports.addCmd = rl => {
     rl.question(colorize(' Introduzca una pregunta: ', 'magenta'), question =>{
       
        rl.question(colorize(' Introduzca su respuesta: ', 'magenta'), answer =>{
          
           model.add(question, answer);
           log(` ${colorize('Se ha añadido', 'blue')}: ${question} ${colorize('=>', 'blue')} ${answer}`);
            rl.prompt();
        });
     });
            
};

exports.deleteCmd = (rl, id) => {
     if (typeof id === "undefined"){
       errorlog(`Falta el parámetro id.`);
     } else{
       try{
         model.deleteByIndex(id);
       } catch(error) {
         errorlog(error.message);
       }
     }
     rl.prompt();
};

exports.editCmd = (rl, id) => {
     if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
      } else{
         try{
           const quiz = model.getByIndex(id);
           
           process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
           
           rl.question(colorize(' Introduzca una pregunta: ', 'magenta'), question =>{
             process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
             
             rl.question(colorize(' Introduzca su respuesta: ', 'magenta'), answer =>{
               model.update(id, question, answer);
               log(` ${colorize('Se ha cambiado el quiz:', 'blue')} ${colorize(id, 'red')} ${colorize('por:', 'blue')}: ${question} ${colorize('=>', 'blue')} ${answer}`);
            rl.prompt();
        });
     });
           
        } catch(error) {
         errorlog(error.message);
         rl.prompt();
       }
      }
};  


exports.testCmd = (rl, id) => {
      if (typeof id === "undefined"){
        errorlog(`Falta el parámetro id.`);
        rl.prompt();
      } 
      else{
         try{
           const quiz = model.getByIndex(id);
           rl.question(quiz.question.toString(), respuesta =>{
             if(respuesta.toLowerCase().trim() === quiz.answer.toLowerCase().trim() ){
               log('Su respuesta es correcta.','black');
               biglog("CORRECTA", 'green');
               rl.prompt();
             }
             else {log('Su respuesta es incorrecta.','black');
               biglog("INCORRECTA", 'red');
               rl.prompt();
             }
           });
         }catch(error) {
         errorlog(error.message);
         rl.prompt();
       }
      }
      
      
};


exports.playCmd =rl=>{

	let puntuacion = 0;
	let preguntas=[];
	let i=0;

	for (i; i< model.count(); i++)
		preguntas[i]=i;

	const playOne=()=>{
		if(preguntas.length==0){
			log(`No hay nada mas que preguntar.`);
			log(`Fin el examen. Aciertos:`);
			biglog(puntuacion ,'magenta');
			rl.prompt();
		}else{
			let id= Math.abs(Math.floor((Math.random()*preguntas.length)));
			  try{
					
					let quiz =model.getByIndex(preguntas[id]);
					preguntas.splice(id,1);
					rl.question(colorize(quiz.question.toString(),'black'), resultado=>{
					if(resultado.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
						puntuacion++;
						log(`correcto`);
						log(`CORRECTO - Lleva ${puntuacion} aciertos.`);
						playOne();
					}else{
						log(`INCORRECTO`);
						log(`incorrecto`);
						log(`Fin del examen. Aciertos:`);
						biglog(puntuacion, 'green');
						rl.prompt();
				    }
				    });    
				}catch(error){
					errorlog(error.message);
					rl.prompt();
				}
			}	
		
	};
	playOne();
};
exports.creditsCmd = rl => {
      log('Autores de la práctica:', 'magenta');
      log('anagonzalezb', 'magenta');
      log('albadelgadof', 'magenta');
      rl.prompt();
};

exports.quitCmd = rl => {
     rl.close();
     rl.prompt();
};
