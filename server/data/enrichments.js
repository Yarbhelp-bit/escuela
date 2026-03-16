// Enrichment data for quiz modes: Image (emoji), Definition (Spanish), Cloze (gapped sentence)
// Keyed by Spanish word. cloze_answer defaults to the key if omitted.

const enrichments = {
  // Lesson 1: Greetings & Basics
  'hola': {
    emoji: '\u{1F44B}',
    definition_es: 'Saludo informal que se usa al encontrar a alguien.',
    cloze_es: '\u00A1___! \u00BFC\u00F3mo est\u00E1s?',
  },
  'adi\u00F3s': {
    emoji: '\u{1F44B}',
    definition_es: 'Palabra que se dice al despedirse de alguien.',
    cloze_es: 'Me tengo que ir, \u00A1___!',
  },
  'por favor': {
    emoji: '\u{1F64F}',
    definition_es: 'Expresi\u00F3n de cortes\u00EDa que se usa para pedir algo.',
    cloze_es: '\u00BFMe ayudas, ___?',
    cloze_answer: 'por favor',
  },
  'gracias': {
    emoji: '\u{1F64F}',
    definition_es: 'Lo que dices cuando alguien te ayuda o te da algo.',
    cloze_es: '___ por tu ayuda.',
  },
  'de nada': {
    emoji: null,
    definition_es: 'Respuesta cort\u00E9s cuando alguien te da las gracias.',
    cloze_es: '\u2014Gracias. \u2014___.',
    cloze_answer: 'de nada',
  },
  's\u00ED': {
    emoji: '\u2705',
    definition_es: 'Palabra afirmativa, lo contrario de no.',
    cloze_es: '___, quiero ir contigo.',
  },
  'no': {
    emoji: '\u274C',
    definition_es: 'Palabra negativa, lo contrario de s\u00ED.',
    cloze_es: '___, no puedo ir hoy.',
  },
  'buenos d\u00EDas': {
    emoji: '\u{1F305}',
    definition_es: 'Saludo que se usa por la ma\u00F1ana.',
    cloze_es: '\u00A1___! \u00BFC\u00F3mo dormiste?',
    cloze_answer: 'buenos d\u00EDas',
  },
  'buenas noches': {
    emoji: '\u{1F319}',
    definition_es: 'Saludo o despedida que se usa de noche.',
    cloze_es: '___, que duermas bien.',
    cloze_answer: 'buenas noches',
  },
  'buenas tardes': {
    emoji: '\u{1F307}',
    definition_es: 'Saludo que se usa despu\u00E9s del mediod\u00EDa.',
    cloze_es: '___, se\u00F1ora Garc\u00EDa.',
    cloze_answer: 'buenas tardes',
  },
  'lo siento': {
    emoji: '\u{1F614}',
    definition_es: 'Expresi\u00F3n para pedir disculpas.',
    cloze_es: '___, no fue mi intenci\u00F3n.',
    cloze_answer: 'lo siento',
  },
  'perd\u00F3n': {
    emoji: '\u{1F614}',
    definition_es: 'Palabra para disculparse o pedir permiso.',
    cloze_es: '___, \u00BFpuedo pasar?',
  },
  'bien': {
    emoji: '\u{1F44D}',
    definition_es: 'De manera satisfactoria o correcta.',
    cloze_es: 'Estoy muy ___, gracias.',
  },
  'mal': {
    emoji: '\u{1F44E}',
    definition_es: 'De manera negativa o incorrecta.',
    cloze_es: 'Me siento ___ hoy.',
  },
  'amigo': {
    emoji: '\u{1F466}',
    definition_es: 'Persona con quien tienes una buena relaci\u00F3n (hombre).',
    cloze_es: 'Juan es mi mejor ___.',
  },
  'amiga': {
    emoji: '\u{1F467}',
    definition_es: 'Persona con quien tienes una buena relaci\u00F3n (mujer).',
    cloze_es: 'Mar\u00EDa es mi mejor ___.',
  },
  'se\u00F1or': {
    emoji: '\u{1F935}',
    definition_es: 'Forma respetuosa de dirigirse a un hombre.',
    cloze_es: 'Buenos d\u00EDas, ___ L\u00F3pez.',
  },
  'se\u00F1ora': {
    emoji: '\u{1F469}',
    definition_es: 'Forma respetuosa de dirigirse a una mujer.',
    cloze_es: 'La ___ Mart\u00EDnez est\u00E1 aqu\u00ED.',
  },
  'nombre': {
    emoji: '\u{1F4DD}',
    definition_es: 'Lo que identifica a una persona o cosa.',
    cloze_es: 'Mi ___ es Carlos.',
  },
  'persona': {
    emoji: '\u{1F9D1}',
    definition_es: 'Un ser humano, un individuo.',
    cloze_es: 'Es una ___ muy amable.',
  },

  // Lesson 2: Numbers & Time
  'uno': {
    emoji: '1\uFE0F\u20E3',
    definition_es: 'El primer n\u00FAmero natural.',
    cloze_es: 'Solo tengo ___ libro.',
  },
  'dos': {
    emoji: '2\uFE0F\u20E3',
    definition_es: 'El n\u00FAmero despu\u00E9s de uno.',
    cloze_es: 'Tengo ___ hermanos.',
  },
  'tres': {
    emoji: '3\uFE0F\u20E3',
    definition_es: 'El n\u00FAmero despu\u00E9s de dos.',
    cloze_es: 'Hay ___ gatos en el jard\u00EDn.',
  },
  'cuatro': {
    emoji: '4\uFE0F\u20E3',
    definition_es: 'El n\u00FAmero despu\u00E9s de tres.',
    cloze_es: 'La mesa tiene ___ patas.',
  },
  'cinco': {
    emoji: '5\uFE0F\u20E3',
    definition_es: 'El n\u00FAmero despu\u00E9s de cuatro.',
    cloze_es: 'Tengo ___ dedos en cada mano.',
  },
  'diez': {
    emoji: '\u{1F51F}',
    definition_es: 'El n\u00FAmero despu\u00E9s de nueve.',
    cloze_es: 'Hay ___ personas en la clase.',
  },
  'veinte': {
    emoji: null,
    definition_es: 'El doble de diez.',
    cloze_es: 'Tengo ___ a\u00F1os.',
  },
  'cien': {
    emoji: '\u{1F4AF}',
    definition_es: 'Diez veces diez.',
    cloze_es: 'Hay ___ personas en la fiesta.',
  },
  'mil': {
    emoji: null,
    definition_es: 'Diez veces cien.',
    cloze_es: 'El libro cuesta ___ pesos.',
  },
  'hora': {
    emoji: '\u{1F550}',
    definition_es: 'Per\u00EDodo de sesenta minutos.',
    cloze_es: 'La clase dura una ___.',
  },
  'minuto': {
    emoji: '\u23F1\uFE0F',
    definition_es: 'Per\u00EDodo de sesenta segundos.',
    cloze_es: 'Espera un ___, por favor.',
  },
  'd\u00EDa': {
    emoji: '\u2600\uFE0F',
    definition_es: 'Per\u00EDodo de veinticuatro horas.',
    cloze_es: 'Hoy es un ___ bonito.',
  },
  'semana': {
    emoji: '\u{1F4C5}',
    definition_es: 'Per\u00EDodo de siete d\u00EDas.',
    cloze_es: 'La ___ tiene siete d\u00EDas.',
  },
  'mes': {
    emoji: '\u{1F4C6}',
    definition_es: 'Per\u00EDodo de aproximadamente treinta d\u00EDas.',
    cloze_es: 'Enero es el primer ___ del a\u00F1o.',
  },
  'a\u00F1o': {
    emoji: '\u{1F5D3}\uFE0F',
    definition_es: 'Per\u00EDodo de doce meses.',
    cloze_es: 'El ___ tiene trescientos sesenta y cinco d\u00EDas.',
  },
  'hoy': {
    emoji: '\u{1F4CC}',
    definition_es: 'Este d\u00EDa, el d\u00EDa actual.',
    cloze_es: '___ es lunes.',
  },
  'ma\u00F1ana': {
    emoji: '\u23ED\uFE0F',
    definition_es: 'El d\u00EDa despu\u00E9s de hoy.',
    cloze_es: '___ vamos al parque.',
  },
  'ayer': {
    emoji: '\u23EE\uFE0F',
    definition_es: 'El d\u00EDa antes de hoy.',
    cloze_es: '___ fui al cine.',
  },
  'ahora': {
    emoji: '\u23F0',
    definition_es: 'En este momento.',
    cloze_es: 'Tengo que irme ___.',
  },
  'siempre': {
    emoji: '\u267E\uFE0F',
    definition_es: 'En todo momento, sin excepci\u00F3n.',
    cloze_es: '___ llego temprano a clase.',
  },

  // Lesson 3: Family
  'familia': {
    emoji: '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}',
    definition_es: 'Grupo de personas unidas por parentesco.',
    cloze_es: 'Mi ___ es muy grande.',
  },
  'madre': {
    emoji: '\u{1F469}',
    definition_es: 'La mujer que te dio la vida.',
    cloze_es: 'Mi ___ cocina muy bien.',
  },
  'padre': {
    emoji: '\u{1F468}',
    definition_es: 'El hombre que te dio la vida.',
    cloze_es: 'Mi ___ trabaja mucho.',
  },
  'hijo': {
    emoji: '\u{1F466}',
    definition_es: 'Un ni\u00F1o en relaci\u00F3n con sus padres (var\u00F3n).',
    cloze_es: 'Pedro es ___ de Mar\u00EDa.',
  },
  'hija': {
    emoji: '\u{1F467}',
    definition_es: 'Una ni\u00F1a en relaci\u00F3n con sus padres (mujer).',
    cloze_es: 'Ana es ___ de Carlos.',
  },
  'hermano': {
    emoji: '\u{1F466}',
    definition_es: 'Var\u00F3n que tiene los mismos padres que t\u00FA.',
    cloze_es: 'Mi ___ mayor tiene veinte a\u00F1os.',
  },
  'hermana': {
    emoji: '\u{1F467}',
    definition_es: 'Mujer que tiene los mismos padres que t\u00FA.',
    cloze_es: 'Mi ___ menor va a la escuela.',
  },
  'abuelo': {
    emoji: '\u{1F474}',
    definition_es: 'El padre de tu padre o tu madre.',
    cloze_es: 'Mi ___ cuenta historias bonitas.',
  },
  'abuela': {
    emoji: '\u{1F475}',
    definition_es: 'La madre de tu padre o tu madre.',
    cloze_es: 'Mi ___ hace galletas deliciosas.',
  },
  't\u00EDo': {
    emoji: '\u{1F468}',
    definition_es: 'Hermano de tu padre o tu madre.',
    cloze_es: 'Mi ___ vive en Madrid.',
  },
  't\u00EDa': {
    emoji: '\u{1F469}',
    definition_es: 'Hermana de tu padre o tu madre.',
    cloze_es: 'Mi ___ es muy divertida.',
  },
  'primo': {
    emoji: '\u{1F466}',
    definition_es: 'Hijo de tu t\u00EDo o t\u00EDa (var\u00F3n).',
    cloze_es: 'Mi ___ viene a visitarnos.',
  },
  'prima': {
    emoji: '\u{1F467}',
    definition_es: 'Hija de tu t\u00EDo o t\u00EDa (mujer).',
    cloze_es: 'Mi ___ estudia medicina.',
  },
  'esposo': {
    emoji: '\u{1F48D}',
    definition_es: 'Hombre casado en relaci\u00F3n con su pareja.',
    cloze_es: 'Su ___ es muy simp\u00E1tico.',
  },
  'esposa': {
    emoji: '\u{1F48D}',
    definition_es: 'Mujer casada en relaci\u00F3n con su pareja.',
    cloze_es: 'Su ___ trabaja en el hospital.',
  },
  'beb\u00E9': {
    emoji: '\u{1F476}',
    definition_es: 'Ni\u00F1o o ni\u00F1a muy peque\u00F1o.',
    cloze_es: 'El ___ est\u00E1 durmiendo.',
  },
  'ni\u00F1o': {
    emoji: '\u{1F466}',
    definition_es: 'Un chico joven, un infante var\u00F3n.',
    cloze_es: 'El ___ juega en el parque.',
  },
  'ni\u00F1a': {
    emoji: '\u{1F467}',
    definition_es: 'Una chica joven, una infante mujer.',
    cloze_es: 'La ___ lee un libro.',
  },
  'sobrino': {
    emoji: '\u{1F466}',
    definition_es: 'Hijo de tu hermano o hermana (var\u00F3n).',
    cloze_es: 'Mi ___ tiene cinco a\u00F1os.',
  },
  'sobrina': {
    emoji: '\u{1F467}',
    definition_es: 'Hija de tu hermano o hermana (mujer).',
    cloze_es: 'Mi ___ va a la escuela.',
  },

  // Lesson 4: Food & Drink
  'agua': {
    emoji: '\u{1F4A7}',
    definition_es: 'L\u00EDquido transparente esencial para vivir.',
    cloze_es: 'Quiero un vaso de ___.',
  },
  'comida': {
    emoji: '\u{1F37D}\uFE0F',
    definition_es: 'Alimento que se come.',
    cloze_es: 'La ___ est\u00E1 lista.',
  },
  'pan': {
    emoji: '\u{1F35E}',
    definition_es: 'Alimento hecho con harina y agua, horneado.',
    cloze_es: 'Quiero ___ con mantequilla.',
  },
  'leche': {
    emoji: '\u{1F95B}',
    definition_es: 'L\u00EDquido blanco que producen las vacas.',
    cloze_es: 'Tomo ___ por la ma\u00F1ana.',
  },
  'caf\u00E9': {
    emoji: '\u2615',
    definition_es: 'Bebida caliente hecha de granos tostados.',
    cloze_es: 'Me gusta el ___ con az\u00FAcar.',
  },
  'cerveza': {
    emoji: '\u{1F37A}',
    definition_es: 'Bebida alcoh\u00F3lica hecha de cebada.',
    cloze_es: '\u00BFQuieres una ___?',
  },
  'vino': {
    emoji: '\u{1F377}',
    definition_es: 'Bebida alcoh\u00F3lica hecha de uvas.',
    cloze_es: 'Este ___ tinto es delicioso.',
  },
  'carne': {
    emoji: '\u{1F969}',
    definition_es: 'Alimento que viene de animales.',
    cloze_es: 'No como ___, soy vegetariano.',
  },
  'pollo': {
    emoji: '\u{1F357}',
    definition_es: 'Ave que se come mucho en todo el mundo.',
    cloze_es: 'El ___ asado est\u00E1 muy rico.',
  },
  'pescado': {
    emoji: '\u{1F41F}',
    definition_es: 'Animal que vive en el agua y se come.',
    cloze_es: 'Me gusta el ___ con lim\u00F3n.',
  },
  'arroz': {
    emoji: '\u{1F35A}',
    definition_es: 'Grano blanco que acompa\u00F1a muchas comidas.',
    cloze_es: 'El ___ con frijoles es t\u00EDpico.',
  },
  'fruta': {
    emoji: '\u{1F34E}',
    definition_es: 'Alimento dulce que crece en \u00E1rboles o plantas.',
    cloze_es: 'Como ___ todos los d\u00EDas.',
  },
  'manzana': {
    emoji: '\u{1F34E}',
    definition_es: 'Fruta redonda, roja o verde.',
    cloze_es: 'Quiero una ___ roja.',
  },
  'naranja': {
    emoji: '\u{1F34A}',
    definition_es: 'Fruta c\u00EDtrica de color anaranjado.',
    cloze_es: 'El jugo de ___ es delicioso.',
  },
  'huevo': {
    emoji: '\u{1F95A}',
    definition_es: 'Lo que pone la gallina.',
    cloze_es: 'Quiero un ___ frito para desayunar.',
  },
  'queso': {
    emoji: '\u{1F9C0}',
    definition_es: 'Alimento hecho con leche, s\u00F3lido y sabroso.',
    cloze_es: 'Me gusta la pizza con mucho ___.',
  },
  'ensalada': {
    emoji: '\u{1F957}',
    definition_es: 'Plato de verduras y vegetales frescos.',
    cloze_es: 'Quiero una ___ de tomate.',
  },
  'sopa': {
    emoji: '\u{1F372}',
    definition_es: 'Plato l\u00EDquido y caliente, hecho con caldo.',
    cloze_es: 'La ___ de pollo est\u00E1 caliente.',
  },
  'postre': {
    emoji: '\u{1F370}',
    definition_es: 'Plato dulce que se come al final de la comida.',
    cloze_es: '\u00BFQu\u00E9 hay de ___?',
  },
  'az\u00FAcar': {
    emoji: '\u{1F36C}',
    definition_es: 'Sustancia dulce usada para endulzar.',
    cloze_es: '\u00BFQuieres ___ en tu caf\u00E9?',
  },

  // Lesson 5: Colors & Descriptions
  'rojo': {
    emoji: '\u{1F534}',
    definition_es: 'Color de la sangre y las rosas.',
    cloze_es: 'Mi coche es ___.',
  },
  'azul': {
    emoji: '\u{1F535}',
    definition_es: 'Color del cielo cuando est\u00E1 despejado.',
    cloze_es: 'El mar es ___.',
  },
  'verde': {
    emoji: '\u{1F7E2}',
    definition_es: 'Color de las plantas y la hierba.',
    cloze_es: 'Las hojas son de color ___.',
  },
  'amarillo': {
    emoji: '\u{1F7E1}',
    definition_es: 'Color del sol y los limones.',
    cloze_es: 'El sol es ___.',
  },
  'negro': {
    emoji: '\u26AB',
    definition_es: 'Color de la noche, ausencia de luz.',
    cloze_es: 'El gato ___ cruz\u00F3 la calle.',
  },
  'blanco': {
    emoji: '\u26AA',
    definition_es: 'Color de la nieve y la leche.',
    cloze_es: 'Las nubes son de color ___.',
  },
  'grande': {
    emoji: '\u{1F418}',
    definition_es: 'De tama\u00F1o superior al normal.',
    cloze_es: 'La casa es muy ___.',
  },
  'peque\u00F1o': {
    emoji: '\u{1F41C}',
    definition_es: 'De tama\u00F1o inferior al normal.',
    cloze_es: 'El rat\u00F3n es muy ___.',
  },
  'bonito': {
    emoji: '\u{1F338}',
    definition_es: 'Agradable a la vista, atractivo.',
    cloze_es: 'El jard\u00EDn es muy ___.',
  },
  'feo': {
    emoji: '\u{1F62C}',
    definition_es: 'No agradable a la vista, lo contrario de bonito.',
    cloze_es: 'Ese edificio es muy ___.',
  },
  'nuevo': {
    emoji: '\u{1F195}',
    definition_es: 'Reci\u00E9n hecho o comprado, lo contrario de viejo.',
    cloze_es: 'Tengo un tel\u00E9fono ___.',
  },
  'viejo': {
    emoji: '\u{1F474}',
    definition_es: 'Que tiene muchos a\u00F1os, lo contrario de nuevo.',
    cloze_es: 'El libro es muy ___.',
  },
  'caliente': {
    emoji: '\u{1F525}',
    definition_es: 'Con temperatura alta.',
    cloze_es: 'La sopa est\u00E1 muy ___.',
  },
  'fr\u00EDo': {
    emoji: '\u{1F9CA}',
    definition_es: 'Con temperatura baja.',
    cloze_es: 'El agua est\u00E1 muy ___.',
  },
  'r\u00E1pido': {
    emoji: '\u{1F3C3}',
    definition_es: 'Que se mueve con velocidad.',
    cloze_es: 'El tren es muy ___.',
  },
  'lento': {
    emoji: '\u{1F422}',
    definition_es: 'Que se mueve sin velocidad.',
    cloze_es: 'La tortuga es muy ___.',
  },
  'feliz': {
    emoji: '\u{1F60A}',
    definition_es: 'Que siente alegr\u00EDa y contento.',
    cloze_es: 'Estoy muy ___ hoy.',
  },
  'triste': {
    emoji: '\u{1F622}',
    definition_es: 'Que siente tristeza, lo contrario de feliz.',
    cloze_es: 'Se siente ___ porque llueve.',
  },
  'fuerte': {
    emoji: '\u{1F4AA}',
    definition_es: 'Que tiene mucha fuerza o poder.',
    cloze_es: 'Mi padre es muy ___.',
  },
  'd\u00E9bil': {
    emoji: null,
    definition_es: 'Que tiene poca fuerza, lo contrario de fuerte.',
    cloze_es: 'Me siento ___ cuando estoy enfermo.',
  },

  // Lesson 6: Around the House
  'casa': {
    emoji: '\u{1F3E0}',
    definition_es: 'Edificio donde vive una familia.',
    cloze_es: 'Mi ___ tiene un jard\u00EDn.',
  },
  'puerta': {
    emoji: '\u{1F6AA}',
    definition_es: 'Parte de la casa que se abre para entrar.',
    cloze_es: 'Abre la ___, por favor.',
  },
  'ventana': {
    emoji: '\u{1FA9F}',
    definition_es: 'Abertura en la pared por donde entra la luz.',
    cloze_es: 'Mira por la ___.',
  },
  'mesa': {
    emoji: null,
    definition_es: 'Mueble con superficie plana para comer o trabajar.',
    cloze_es: 'La comida est\u00E1 en la ___.',
  },
  'silla': {
    emoji: '\u{1FA91}',
    definition_es: 'Mueble para sentarse con respaldo.',
    cloze_es: 'Si\u00E9ntate en la ___.',
  },
  'cama': {
    emoji: '\u{1F6CF}\uFE0F',
    definition_es: 'Mueble donde se duerme.',
    cloze_es: 'Me acuesto en la ___ a las diez.',
  },
  'cocina': {
    emoji: '\u{1F373}',
    definition_es: 'Habitaci\u00F3n donde se prepara la comida.',
    cloze_es: 'Mi madre est\u00E1 en la ___.',
  },
  'ba\u00F1o': {
    emoji: '\u{1F6BF}',
    definition_es: 'Habitaci\u00F3n con ducha y lavabo.',
    cloze_es: 'Voy al ___ a ducharme.',
  },
  'habitaci\u00F3n': {
    emoji: '\u{1F6CF}\uFE0F',
    definition_es: 'Cuarto de una casa, especialmente el dormitorio.',
    cloze_es: 'Mi ___ es grande y tiene mucha luz.',
  },
  'jard\u00EDn': {
    emoji: '\u{1F333}',
    definition_es: 'Espacio exterior con plantas y flores.',
    cloze_es: 'Las flores del ___ son bonitas.',
  },
  'escalera': {
    emoji: '\u{1FA9C}',
    definition_es: 'Estructura con pelda\u00F1os para subir o bajar.',
    cloze_es: 'Sube por la ___.',
  },
  'techo': {
    emoji: null,
    definition_es: 'Parte superior que cubre una casa.',
    cloze_es: 'El ___ es de color rojo.',
  },
  'piso': {
    emoji: null,
    definition_es: 'Superficie donde se camina dentro de la casa.',
    cloze_es: 'El ___ est\u00E1 limpio.',
  },
  'pared': {
    emoji: null,
    definition_es: 'Superficie vertical de una habitaci\u00F3n.',
    cloze_es: 'Hay un cuadro en la ___.',
  },
  'llave': {
    emoji: '\u{1F511}',
    definition_es: 'Objeto de metal para abrir una puerta.',
    cloze_es: 'No encuentro mi ___.',
  },
  'luz': {
    emoji: '\u{1F4A1}',
    definition_es: 'Energ\u00EDa que permite ver.',
    cloze_es: 'Enciende la ___, por favor.',
  },
  'espejo': {
    emoji: '\u{1FA9E}',
    definition_es: 'Superficie donde puedes ver tu reflejo.',
    cloze_es: 'Me miro en el ___.',
  },
  'reloj': {
    emoji: '\u231A',
    definition_es: 'Instrumento que muestra la hora.',
    cloze_es: 'El ___ marca las tres.',
  },
  'tel\u00E9fono': {
    emoji: '\u{1F4F1}',
    definition_es: 'Aparato para comunicarse a distancia.',
    cloze_es: '\u00BFD\u00F3nde est\u00E1 mi ___?',
  },
  'libro': {
    emoji: '\u{1F4DA}',
    definition_es: 'Conjunto de p\u00E1ginas con texto para leer.',
    cloze_es: 'Estoy leyendo un ___ interesante.',
  },

  // Lesson 7: Common Verbs
  'ser': {
    emoji: null,
    definition_es: 'Existir o tener una caracter\u00EDstica permanente.',
    cloze_es: 'Quiero ___ m\u00E9dico cuando sea grande.',
  },
  'estar': {
    emoji: null,
    definition_es: 'Encontrarse en un lugar o estado temporal.',
    cloze_es: '\u00BFD\u00F3nde vas a ___ esta noche?',
  },
  'tener': {
    emoji: null,
    definition_es: 'Poseer algo.',
    cloze_es: 'Necesito ___ m\u00E1s paciencia.',
  },
  'hacer': {
    emoji: null,
    definition_es: 'Realizar una actividad o crear algo.',
    cloze_es: '\u00BFQu\u00E9 vas a ___ ma\u00F1ana?',
  },
  'ir': {
    emoji: null,
    definition_es: 'Moverse de un lugar a otro.',
    cloze_es: 'Quiero ___ al cine esta noche.',
  },
  'venir': {
    emoji: null,
    definition_es: 'Moverse hacia donde est\u00E1 el hablante.',
    cloze_es: '\u00BFPuedes ___ a mi fiesta?',
  },
  'poder': {
    emoji: '\u{1F4AA}',
    definition_es: 'Tener la capacidad o habilidad de hacer algo.',
    cloze_es: 'Sin dinero no puedo ___ comprar nada.',
    cloze_answer: 'poder',
  },
  'querer': {
    emoji: '\u2764\uFE0F',
    definition_es: 'Desear o amar algo o a alguien.',
    cloze_es: 'Voy a ___ siempre a mi familia.',
  },
  'saber': {
    emoji: '\u{1F9E0}',
    definition_es: 'Tener conocimiento de algo.',
    cloze_es: 'Necesito ___ la verdad.',
  },
  'conocer': {
    emoji: null,
    definition_es: 'Tener experiencia con una persona o lugar.',
    cloze_es: 'Quiero ___ Espa\u00F1a alg\u00FAn d\u00EDa.',
  },
  'hablar': {
    emoji: '\u{1F5E3}\uFE0F',
    definition_es: 'Comunicarse usando palabras.',
    cloze_es: 'Quiero aprender a ___ espa\u00F1ol.',
  },
  'comer': {
    emoji: '\u{1F37D}\uFE0F',
    definition_es: 'Ingerir alimentos.',
    cloze_es: 'Vamos a ___ en un restaurante.',
  },
  'beber': {
    emoji: '\u{1F964}',
    definition_es: 'Ingerir l\u00EDquidos.',
    cloze_es: 'Necesito ___ m\u00E1s agua.',
  },
  'vivir': {
    emoji: '\u{1F3E0}',
    definition_es: 'Tener vida, existir, o residir en un lugar.',
    cloze_es: 'Quiero ___ cerca del mar.',
  },
  'trabajar': {
    emoji: '\u{1F4BC}',
    definition_es: 'Realizar una actividad laboral.',
    cloze_es: 'Mi padre va a ___ todos los d\u00EDas.',
  },
  'estudiar': {
    emoji: '\u{1F4D6}',
    definition_es: 'Aprender, dedicar tiempo al conocimiento.',
    cloze_es: 'Necesito ___ para el examen.',
  },
  'leer': {
    emoji: '\u{1F4D6}',
    definition_es: 'Interpretar texto escrito.',
    cloze_es: 'Me gusta ___ libros de aventuras.',
  },
  'escribir': {
    emoji: '\u270F\uFE0F',
    definition_es: 'Representar palabras con letras.',
    cloze_es: 'Tengo que ___ una carta.',
  },
  'dormir': {
    emoji: '\u{1F634}',
    definition_es: 'Descansar con los ojos cerrados.',
    cloze_es: 'Necesito ___ ocho horas.',
  },
  'jugar': {
    emoji: '\u26BD',
    definition_es: 'Realizar una actividad por diversi\u00F3n.',
    cloze_es: 'Los ni\u00F1os quieren ___ en el parque.',
  },

  // Lesson 8: Places & Travel
  'ciudad': {
    emoji: '\u{1F3D9}\uFE0F',
    definition_es: 'Lugar grande donde viven muchas personas.',
    cloze_es: 'Madrid es una ___ bonita.',
  },
  'calle': {
    emoji: '\u{1F6E3}\uFE0F',
    definition_es: 'Camino entre edificios en una ciudad.',
    cloze_es: 'Vivo en la ___ principal.',
  },
  'tienda': {
    emoji: '\u{1F3EA}',
    definition_es: 'Lugar donde se compran cosas.',
    cloze_es: 'Voy a la ___ a comprar leche.',
  },
  'restaurante': {
    emoji: '\u{1F37D}\uFE0F',
    definition_es: 'Lugar donde se come y se paga.',
    cloze_es: 'Vamos a cenar en un ___.',
  },
  'hospital': {
    emoji: '\u{1F3E5}',
    definition_es: 'Lugar donde se atiende a los enfermos.',
    cloze_es: 'Mi madre trabaja en el ___.',
  },
  'escuela': {
    emoji: '\u{1F3EB}',
    definition_es: 'Lugar donde los ni\u00F1os van a aprender.',
    cloze_es: 'Los ni\u00F1os van a la ___ por la ma\u00F1ana.',
  },
  'iglesia': {
    emoji: '\u26EA',
    definition_es: 'Edificio donde la gente va a rezar.',
    cloze_es: 'La ___ est\u00E1 en la plaza.',
  },
  'playa': {
    emoji: '\u{1F3D6}\uFE0F',
    definition_es: 'Zona de arena junto al mar.',
    cloze_es: 'En verano vamos a la ___.',
  },
  'monta\u00F1a': {
    emoji: '\u26F0\uFE0F',
    definition_es: 'Elevaci\u00F3n grande y natural del terreno.',
    cloze_es: 'La ___ tiene nieve en la cima.',
  },
  'r\u00EDo': {
    emoji: '\u{1F30A}',
    definition_es: 'Corriente de agua que va hacia el mar.',
    cloze_es: 'El ___ pasa por la ciudad.',
  },
  'aeropuerto': {
    emoji: '\u2708\uFE0F',
    definition_es: 'Lugar donde despegan y aterrizan los aviones.',
    cloze_es: 'Vamos al ___ a las seis.',
  },
  'estaci\u00F3n': {
    emoji: '\u{1F682}',
    definition_es: 'Lugar donde se toman trenes o autobuses.',
    cloze_es: 'El tren sale de la ___ central.',
  },
  'hotel': {
    emoji: '\u{1F3E8}',
    definition_es: 'Establecimiento para dormir cuando viajas.',
    cloze_es: 'Reservamos un ___ cerca de la playa.',
  },
  'museo': {
    emoji: '\u{1F3DB}\uFE0F',
    definition_es: 'Lugar donde se exhiben obras de arte o historia.',
    cloze_es: 'El ___ tiene pinturas famosas.',
  },
  'parque': {
    emoji: '\u{1F333}',
    definition_es: 'Espacio verde para pasear y jugar.',
    cloze_es: 'Los ni\u00F1os juegan en el ___.',
  },
  'mercado': {
    emoji: '\u{1F6D2}',
    definition_es: 'Lugar donde se venden alimentos frescos.',
    cloze_es: 'Compro frutas en el ___.',
  },
  'banco': {
    emoji: '\u{1F3E6}',
    definition_es: 'Instituci\u00F3n donde se guarda dinero.',
    cloze_es: 'Necesito ir al ___ a sacar dinero.',
  },
  'biblioteca': {
    emoji: '\u{1F4DA}',
    definition_es: 'Lugar con muchos libros para leer o estudiar.',
    cloze_es: 'Estudio en la ___ de la universidad.',
  },
  'oficina': {
    emoji: '\u{1F3E2}',
    definition_es: 'Lugar donde se trabaja.',
    cloze_es: 'Mi padre est\u00E1 en su ___.',
  },
  'pa\u00EDs': {
    emoji: '\u{1F30D}',
    definition_es: 'Territorio con gobierno propio.',
    cloze_es: 'M\u00E9xico es un ___ muy bonito.',
  },

  // Lesson 9: Body & Health
  'cabeza': {
    emoji: '\u{1F9E0}',
    definition_es: 'Parte superior del cuerpo donde est\u00E1 el cerebro.',
    cloze_es: 'Me duele la ___.',
  },
  'ojo': {
    emoji: '\u{1F441}\uFE0F',
    definition_es: '\u00D3rgano con el que vemos.',
    cloze_es: 'Tiene un ___ azul y uno verde.',
  },
  'nariz': {
    emoji: '\u{1F443}',
    definition_es: 'Parte de la cara por donde respiramos.',
    cloze_es: 'Tengo la ___ roja por el fr\u00EDo.',
  },
  'boca': {
    emoji: '\u{1F444}',
    definition_es: 'Parte de la cara por donde comemos y hablamos.',
    cloze_es: 'Cierra la ___ cuando comes.',
  },
  'oreja': {
    emoji: '\u{1F442}',
    definition_es: 'Parte del cuerpo con la que o\u00EDmos.',
    cloze_es: 'Me duele la ___ izquierda.',
  },
  'mano': {
    emoji: '\u270B',
    definition_es: 'Parte del cuerpo al final del brazo.',
    cloze_es: 'Dame la ___, por favor.',
  },
  'pie': {
    emoji: '\u{1F9B6}',
    definition_es: 'Parte del cuerpo al final de la pierna.',
    cloze_es: 'Me duele el ___ derecho.',
  },
  'brazo': {
    emoji: '\u{1F4AA}',
    definition_es: 'Parte del cuerpo entre el hombro y la mano.',
    cloze_es: 'Me romp\u00ED el ___ jugando.',
  },
  'pierna': {
    emoji: '\u{1F9B5}',
    definition_es: 'Parte del cuerpo entre la cadera y el pie.',
    cloze_es: 'Me duele la ___ despu\u00E9s de correr.',
  },
  'coraz\u00F3n': {
    emoji: '\u2764\uFE0F',
    definition_es: '\u00D3rgano que bombea la sangre.',
    cloze_es: 'El ___ late muy r\u00E1pido.',
  },
  'est\u00F3mago': {
    emoji: null,
    definition_es: '\u00D3rgano donde se digiere la comida.',
    cloze_es: 'Me duele el ___ despu\u00E9s de comer.',
  },
  'espalda': {
    emoji: null,
    definition_es: 'Parte posterior del cuerpo, entre el cuello y la cintura.',
    cloze_es: 'Me duele la ___ de tanto trabajar.',
  },
  'diente': {
    emoji: '\u{1F9B7}',
    definition_es: 'Pieza dura y blanca en la boca para masticar.',
    cloze_es: 'El ni\u00F1o perdi\u00F3 un ___.',
  },
  'pelo': {
    emoji: '\u{1F487}',
    definition_es: 'Lo que crece en la cabeza.',
    cloze_es: 'Tiene el ___ muy largo.',
  },
  'dedo': {
    emoji: '\u{1F446}',
    definition_es: 'Cada una de las cinco partes de la mano.',
    cloze_es: 'Me cort\u00E9 el ___ con un cuchillo.',
  },
  'dolor': {
    emoji: '\u{1F623}',
    definition_es: 'Sensaci\u00F3n desagradable en el cuerpo.',
    cloze_es: 'Tengo un ___ de cabeza fuerte.',
  },
  'm\u00E9dico': {
    emoji: '\u{1F468}\u200D\u2695\uFE0F',
    definition_es: 'Profesional que cura enfermedades.',
    cloze_es: 'Voy al ___ porque estoy enfermo.',
  },
  'enfermo': {
    emoji: '\u{1F912}',
    definition_es: 'Que tiene una enfermedad, que no est\u00E1 sano.',
    cloze_es: 'Mi hermano est\u00E1 ___ hoy.',
  },
  'medicina': {
    emoji: '\u{1F48A}',
    definition_es: 'Sustancia que se toma para curar enfermedades.',
    cloze_es: 'Toma la ___ tres veces al d\u00EDa.',
  },
  'salud': {
    emoji: '\u{1F49A}',
    definition_es: 'Estado de bienestar f\u00EDsico.',
    cloze_es: 'La ___ es lo m\u00E1s importante.',
  },

  // Lesson 10: Everyday Expressions
  '\u00BFcu\u00E1nto cuesta?': {
    emoji: '\u{1F4B0}',
    definition_es: 'Pregunta para saber el precio de algo.',
    cloze_es: 'Quiero comprar este libro. \u00BFCu\u00E1nto ___?',
    cloze_answer: 'cuesta',
  },
  '\u00BFd\u00F3nde est\u00E1?': {
    emoji: '\u{1F4CD}',
    definition_es: 'Pregunta para saber la ubicaci\u00F3n de algo.',
    cloze_es: 'No encuentro el ba\u00F1o. \u00BFD\u00F3nde ___?',
    cloze_answer: 'est\u00E1',
  },
  '\u00BFc\u00F3mo est\u00E1s?': {
    emoji: null,
    definition_es: 'Pregunta sobre el estado de una persona.',
    cloze_es: '\u00A1Hola, Mar\u00EDa! \u00BFC\u00F3mo ___?',
    cloze_answer: 'est\u00E1s',
  },
  '\u00BFqu\u00E9 hora es?': {
    emoji: '\u{1F550}',
    definition_es: 'Pregunta para saber la hora actual.',
    cloze_es: 'No tengo reloj. \u00BFQu\u00E9 ___ es?',
    cloze_answer: 'hora',
  },
  'me gusta': {
    emoji: '\u2764\uFE0F',
    definition_es: 'Expresi\u00F3n de agrado o preferencia.',
    cloze_es: 'Me ___ mucho el chocolate.',
    cloze_answer: 'gusta',
  },
  'no entiendo': {
    emoji: '\u{1F937}',
    definition_es: 'Expresi\u00F3n para decir que no comprendes.',
    cloze_es: 'Habla m\u00E1s despacio, no ___.',
    cloze_answer: 'entiendo',
  },
  'necesito': {
    emoji: null,
    definition_es: 'Expresi\u00F3n de necesidad.',
    cloze_es: '___ ayuda con mi tarea.',
  },
  'quiero': {
    emoji: null,
    definition_es: 'Expresi\u00F3n de deseo.',
    cloze_es: '___ un caf\u00E9 con leche, por favor.',
  },
  'tengo hambre': {
    emoji: '\u{1F60B}',
    definition_es: 'Expresi\u00F3n para decir que necesitas comer.',
    cloze_es: 'No he comido nada. Tengo ___.',
    cloze_answer: 'hambre',
  },
  'tengo sed': {
    emoji: '\u{1F964}',
    definition_es: 'Expresi\u00F3n para decir que necesitas beber.',
    cloze_es: 'Hace mucho calor. Tengo ___.',
    cloze_answer: 'sed',
  },
  'estoy cansado': {
    emoji: '\u{1F62B}',
    definition_es: 'Expresi\u00F3n para decir que necesitas descansar.',
    cloze_es: 'Trabaj\u00E9 mucho hoy. Estoy ___.',
    cloze_answer: 'cansado',
  },
  'tengo fr\u00EDo': {
    emoji: '\u{1F976}',
    definition_es: 'Expresi\u00F3n para decir que sientes baja temperatura.',
    cloze_es: 'Est\u00E1 nevando afuera. Tengo ___.',
    cloze_answer: 'fr\u00EDo',
  },
  'tengo calor': {
    emoji: '\u{1F975}',
    definition_es: 'Expresi\u00F3n para decir que sientes alta temperatura.',
    cloze_es: 'Estamos en agosto. Tengo ___.',
    cloze_answer: 'calor',
  },
  'con permiso': {
    emoji: null,
    definition_es: 'Expresi\u00F3n cort\u00E9s para pedir paso.',
    cloze_es: 'Con ___, necesito pasar.',
    cloze_answer: 'permiso',
  },
  '\u00A1salud!': {
    emoji: '\u{1F942}',
    definition_es: 'Expresi\u00F3n al brindar o cuando alguien estornuda.',
    cloze_es: 'Vamos a brindar. \u00A1___!',
    cloze_answer: 'salud',
  },
  'claro': {
    emoji: null,
    definition_es: 'Expresi\u00F3n afirmativa que significa por supuesto.',
    cloze_es: '\u2014\u00BFVienes a la fiesta? \u2014\u00A1___!',
  },
  'tal vez': {
    emoji: null,
    definition_es: 'Expresi\u00F3n que indica posibilidad.',
    cloze_es: 'No estoy seguro, ___ llueva ma\u00F1ana.',
    cloze_answer: 'tal vez',
  },
  'por supuesto': {
    emoji: null,
    definition_es: 'Expresi\u00F3n que confirma algo con certeza.',
    cloze_es: '\u2014\u00BFMe ayudas? \u2014Por ___, amigo.',
    cloze_answer: 'supuesto',
  },
  '\u00A1buen provecho!': {
    emoji: '\u{1F37D}\uFE0F',
    definition_es: 'Expresi\u00F3n que se dice antes de comer.',
    cloze_es: 'La comida est\u00E1 lista. \u00A1Buen ___!',
    cloze_answer: 'provecho',
  },
  '\u00A1buena suerte!': {
    emoji: '\u{1F340}',
    definition_es: 'Expresi\u00F3n de buenos deseos antes de algo dif\u00EDcil.',
    cloze_es: 'Tienes examen ma\u00F1ana. \u00A1Buena ___!',
    cloze_answer: 'suerte',
  },
};

export default enrichments;
