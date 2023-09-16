const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


// Clases de personajes 
class NPC {
    constructor(nombre, HP, MP, Atk, Def, habilidadEspecialNombre, max_values) {
        this.initialData = { HP, MP, Atk, Def, EstoyMuerto: false }
        this.nombre = nombre
        this.HP = HP
        this.MP = MP
        this.Atk = Atk
        this.Def = Def
        this.estado = [0, "Limpio"]
        this.EstoyMuerto = false
        this.habilidadEspecialNombre = habilidadEspecialNombre ?? 'furia'
        this.max_values = Object.freeze(max_values ?? {
            ataque: 2000
        })
    }


    morir() {
        this.EstoyMuerto = true
        this.HP = 0;
    }

    atacar(target) {

        if (target.EstoyMuerto) { mensaje2 = "El ataque a fallado"; mensaje = target.nombre + " ya esta muerto" }
        else {

            let ataque = this.calcularAtaque();
            target.recibirAtaque(ataque);

            console.info(this.nombre + " A ATACADO")
        }
    }

    habilidadEspecial(target) {
        throw new Error('Method Not Implemented')
    }

    calcularAtaque(ataque_escalado) {
        ataque_escalado < 0 ? 0 : ataque_escalado;
        return Math.min(this.max_values.ataque, ataque_escalado)
    }

    recibirAtaque(valor) {

        let suerte = Math.floor(Math.random() * 10) + 1;


        if (suerte <= 3) {
            valor += this.Def;
            mensaje2 = "El Daño es critico"

        } else if (suerte >= 9) {
            valor = 0;
            mensaje2 = "El ataque a fallado"
        }

        mensaje = this.nombre + " a recibido " + valor + " de daño.";


        this.HP -= valor
        if (this.HP <= 0) {
            this.morir()
        }

    }

    recibirCuracion(valor) {
        this.HP += valor
    }

    recibirDefensa(valor) {
        this.Def += valor
    }

    reset() {
        for (const key of Object.keys(this.initialData)) {
            this[key] = this.initialData[key]
        }
    }
}
class Combatiente extends NPC {
    constructor(nombre, HP, MP, Atk, Def) {
        super(nombre, HP, MP, Atk, Def, 'Furia')
        this.Max_HP = HP;

    }

    calcularAtaque() {
        const Hp_perdida = this.Max_HP - this.HP;
        const ataque_calculado = (this.Atk * 1.2 + Hp_perdida * 0.2)
        return super.calcularAtaque(ataque_calculado)
    }

    habilidadEspecial() {

        if (this.MP < 100) {
            console.error("No tienes suficiente Mana")
        } else {

            let aumento_atk = this.Atk * 0.4;
            this.Atk += aumento_atk;
            this.MP -= 100;

            console.info(this.nombre + " uso habilidad en ")
            mensaje = this.nombre + " obtiene " + aumento_atk + " puntos de ataque"

        }
    }

}
class Healer extends NPC {
    constructor(nombre, HP, MP, Atk, Def) {
        super(nombre, HP, MP, Atk, Def, 'Curar')
        this.Max_HP = HP;
        this.Max_MP = MP;


    }



    calcularAtaque() {
        const ataque_calculado = (this.Atk * 0.7 + this.Max_MP * 2.3)
        return super.calcularAtaque(ataque_calculado)
    }

    habilidadEspecial(target) {
        if (this.MP < 100) {
            console.error("No tienes suficiente Mana")
        } else {
            this.MP -= 100;
            const Hp_perdida = target.Max_HP - target.HP;
            const curacion = Hp_perdida * 0.5;
            target.recibirCuracion(curacion)

            console.info(target.nombre + " a recuperado " + curacion + " puntos de HP")
            mensaje = target.nombre + " a recuperado " + curacion + " puntos de HP"
        }


    }

}
class Tanque extends NPC {
    constructor(nombre, HP, MP, Atk, Def) {
        super(nombre, HP, MP, Atk, Def, 'Escudo')
        this.Max_HP = HP;
        this.Max_MP = MP;


    }


    calcularAtaque() {
        const ataque_calculado = (this.Atk * 0.2 + this.Max_HP * 0.2)
        return super.calcularAtaque(ataque_calculado)
    }

    habilidadEspecial(target) {
        if (this.MP < 100) {
            console.error("No tienes suficiente Mana")
        } else {
            this.MP -= 100;
            const Hp_perdida = target.Max_HP - target.HP;
            const escudo = Hp_perdida * 0.2;

            target.recibirDefensa(escudo)
            console.info(target.nombre + " a obtenido " + escudo + " puntos de defensa")
            mensaje = target.nombre + " a obtenido " + escudo + " puntos de defensa"
        }
    }

}
class Brujo extends NPC {
    constructor(nombre, HP, MP, Atk, Def) {
        super(nombre, HP, MP, Atk, Def, 'Curar')
        this.Max_HP = HP;
        this.Max_MP = MP;


    }


    calcularAtaque() {
        const ataque_calculado = (this.Atk * 0.5 + this.Max_MP * 2)
        return super.calcularAtaque(ataque_calculado)
    }

    habilidadEspecial(target) {
        if (this.MP < 100) {
            console.error("No tienes suficiente Mana")
        } else {
            this.MP -= 100;
            let robo = this.calcularAtaque() - target.Def * 0.9;
            target.recibirAtaque(robo);
            this.recibirCuracion(robo);

            console.info(this.nombre + " le a robado" + robo + " puntos de HP a " + target.nombre)
            mensaje = this.nombre + " le a robado" + robo + " puntos de HP a " + target.nombre



        }


    }

}
class Arquero extends NPC {
    constructor(nombre, HP, MP, Atk, Def) {
        super(nombre, HP, MP, Atk, Def, 'Furia')
        this.Max_HP = HP;

    }

    calcularAtaque() {

        const ataque_calculado = (this.Atk * 1.8)
        return super.calcularAtaque(ataque_calculado)
    }

    habilidadEspecial(target1, target2, target3) {
        if (this.MP < 100) {
            console.error("No tienes suficiente Mana")
        } else {

            console.log(target1.nombre)
            console.log(target2.nombre)
            console.log(target3.nombre)

            this.MP -= 100;

            let ataque = this.Atk * 1.2;

            target1.HP -= ataque
            target2.HP -= ataque
            target3.HP -= ataque

            if (target1.HP <= 0) { target3.morir() }
            if (target2.HP <= 0) { target3.morir() }
            if (target3.HP <= 0) { target3.morir() }

            console.info(target1.nombre + ", " + target2.nombre + ", " + target3.nombre + " recibieron " + ataque + " de daño de  habilidad.")
            mensaje = "El equipo contrario recibio " + ataque + " puntos de daño"
        }
    }

}
class Mago extends NPC {
    constructor(nombre, HP, MP, Atk, Def) {
        super(nombre, HP, MP, Atk, Def, 'Curar')
        this.Max_HP = HP;
        this.Max_MP = MP;

    }


    calcularAtaque() {
        const ataque_calculado = (this.Atk * 0.6 + this.Max_MP * 2.7)
        return super.calcularAtaque(ataque_calculado)
    }

    habilidadEspecial(target) {
        if (this.MP < 100) {
            console.error("No tienes suficiente Mana")
        } else {
            this.MP -= 100;

            target.estado[0] = Math.floor(Math.random() * 3) + 1;;
            target.estado[1] = "Congelacion";

            console.info(target.nombre + " esta congelado ")
            mensaje = target.nombre + " esta congelado "




        }


    }

}


// Clase de botones e imagenes
class Asset {
    constructor({ x, y, w, h, nombre, visible, imagenURL, deadImagenUrl, infoImageUrl, evento, isCharacter, clicked }) {
        this.initialData = { x, y, clicked }
        this.y = y
        this.x = x
        this.w = w
        this.h = h
        this.nombre = nombre
        this.clicked = clicked ?? false;
        this.imagenUrl = imagenURL
        this.deadImagenUrl = deadImagenUrl
        this.infoImageUrl = infoImageUrl
        this.isCharacter = isCharacter ?? false
        this.avatar = NPCs.find((avatar) => avatar.nombre === nombre);
        this.evento = evento ?? function () {
            if (this.isCharacter) {
                switch (accion) {
                    case "Mostrar":

                        if (!this.isShowingStats) {
                            MostrarStats(this.infoImageUrl, this.x, this.y);
                            this.isShowingStats = true;
                        } else {

                            if (this.avatar.HP <= 0) { MostrarStats(this.deadImagenUrl, this.x, this.y); this.isShowingStats = false; }
                            else {
                                MostrarStats(this.imagenUrl, this.x, this.y);
                                this.isShowingStats = false;
                            }
                        }

                        if (equipoPelea.length <= 3) {

                            const indiceEnEquipo = equipoPelea.findIndex((npc) => npc.nombre === this.nombre);

                            if (indiceEnEquipo === -1) {
                                if (equipoPelea.length >= 3) {

                                    const primerElemento = equipoPelea[0].nombre;
                                    const ID = assets.findIndex((asset) => asset.nombre === primerElemento);

                                    if (ID !== -1) {
                                        assets[ID].isShowingStats = false;
                                        MostrarStats(assets[ID].imagenUrl, assets[ID].x, assets[ID].y);
                                    }

                                    equipoPelea.splice(0, 1);
                                }

                                equipoPelea.push(this.avatar);
                            } else {
                                equipoPelea.splice(indiceEnEquipo, 1);
                            }
                        }
                        break;
                    case "Atacar":

                        const target = equipoPelea.findIndex((asset) => asset.nombre === this.nombre);
                        console.log(equipoPelea[target].nombre)
                        equipoPelea[turno].atacar(equipoPelea[target])

                        actualizar()
                        DibujarMensaje(mensaje, 500, 530)
                        DibujarBotones(9)


                        break;
                    case "Habilidad":

                        const target2 = equipoPelea.findIndex((asset) => asset.nombre === this.nombre);
                        console.log(equipoPelea[target2])
                        equipoPelea[turno].habilidadEspecial(equipoPelea[target2])

                        actualizar()
                        DibujarMensaje(mensaje, 500, 530)
                        DibujarBotones(9)

                        break;
                }

            }
        };
    }

    reset() {

        for (const key of Object.keys(this.initialData)) {
            this[key] = this.initialData[key]
        }
    }


}


//variables varias
let equipoPelea = [];
var turno = -1;
var accion = "Mostrar";
var mensaje = "";
var mensaje2 = "";



//arreglos
const NPCs = [
    new Combatiente("The Bald", 3000, 300, 500, 200),
    new Healer("Rony", 2000, 400, 100, 500),
    new Tanque("The One", 4000, 300, 200, 500),
    new Brujo("El Nigga", 2500, 400, 200, 200),
    new Arquero("Gerrillero", 2000, 300, 500, 200),
    new Mago("Oraculo", 2500, 400, 200, 200),
];

const assets = [
    new Asset({ x: 200, y: 50, w: 150, h: 200, nombre: "The Bald", imagenURL: "./Img/Avatar/Drassus.png", deadImagenUrl: "./Img/AvatarDeath/DrassusDead.png", infoImageUrl: "./Img/Info/Drassus.png", isCharacter: true }),
    new Asset({ x: 400, y: 50, w: 150, h: 200, nombre: "Rony", imagenURL: "./Img/Avatar/Zoranya.png", deadImagenUrl: "./Img/AvatarDeath/ZoranyaDead.png", infoImageUrl: "./Img/Info/Zoranya.png", isCharacter: true }),
    new Asset({ x: 600, y: 50, w: 150, h: 200, nombre: "The One", imagenURL: "./Img/Avatar/Aincra.png", deadImagenUrl: "./Img/AvatarDeath/AincraDead.png", infoImageUrl: "./Img/Info/Aincra.png", isCharacter: true }),
    new Asset({ x: 800, y: 50, w: 150, h: 200, nombre: "El Nigga", imagenURL: "./Img/Avatar/Nefura.png", deadImagenUrl: "./Img/AvatarDeath/NefuraDead.png", infoImageUrl: "./Img/Info/Nefura.png", isCharacter: true }),
    new Asset({ x: 1000, y: 50, w: 150, h: 200, nombre: "Gerrillero", imagenURL: "./Img/Avatar/Dracnet.png", deadImagenUrl: "./Img/AvatarDeath/DracnetDead.png", infoImageUrl: "./Img/Info/Dracnet.png", isCharacter: true }),
    new Asset({ x: 1200, y: 50, w: 150, h: 200, nombre: "Oraculo", imagenURL: "./Img/Avatar/Dreinos.png", deadImagenUrl: "./Img/AvatarDeath/DreinosDead.png", infoImageUrl: "./Img/Info/Dreinos.png", isCharacter: true }),

    //botones
    new Asset({//6 BotonContinuar0
        x: 620, y: 550, w: 200, h: 70, nombre: "BotonContinuar0", imagenURL: "./Img/Botones/BotonContinuar.png",
        evento: function () { Formacion(); MenuObtion(); console.log(this.nombre); this.clicked = true; }
    }),
    new Asset({//7 BotonAtacar
        x: 450, y: 550, w: 200, h: 70, nombre: "BotonAtacar", imagenURL: "./Img/Botones/Atacar.png",
        evento: function () { console.log(this.nombre); this.clicked = true; accion = "Atacar"; DibujarMensaje("Seleccionar objetivos", 570, 530) }
    }),
    new Asset({//8 BotonHabilida
        x: 850, y: 550, w: 200, h: 70, nombre: "BotonHabilida", imagenURL: "./Img/Botones/Boton_habilidad.png",
        evento: function () {
            console.log(this.nombre); this.clicked = true;

            if (equipoPelea[turno].nombre == "Gerrillero") {

                let x = 0;
                const ID = equipoPelea.findIndex((stage) => stage.nombre === equipoPelea[turno].nombre);

                if (ID < 3) { x = 3 }
                equipoPelea[turno].habilidadEspecial(equipoPelea[x], equipoPelea[x + 1], equipoPelea[x + 2])

                actualizar()
                DibujarMensaje(mensaje, 500, 530)
                DibujarBotones(9)

            }
            else if (equipoPelea[turno].nombre == "The Bald") {

                equipoPelea[turno].habilidadEspecial()

                actualizar()
                DibujarMensaje(mensaje, 500, 530)
                DibujarBotones(9)

            }

            else {
                DibujarMensaje("Seleccionar objetivos", 570, 530)
                accion = "Habilidad";
            }
        }
    }),
    new Asset({//9 BotonContinuar1
        x: 620, y: 550, w: 200, h: 70, nombre: "BotonContinuar1", imagenURL: "./Img/Botones/BotonContinuar.png", clicked: true,
        evento: function () {
            console.log(this.nombre);
            MenuObtion();
            //this.clicked = true;
        }
    }),
    new Asset({//10 BotonFinal
        x: 620, y: 500, w: 200, h: 70, nombre: "BotonFinal", imagenURL: "./Img/Botones/BotonFinal.png", clicked: true,
        evento: function () { console.log(this.nombre); this.clicked = true; GameStart() }
    }),
    new Asset({//11 BotonStart
        x: 650, y: 300, w: 200, h: 70, nombre: "BotonStart", imagenURL: "./Img/Botones/BotonStart.png",
        evento: function () { console.log(this.nombre); SelecionAvatar(); this.clicked = true; }
    }),


]


//controladores de dibujos
function SelecionAvatar() {

    for (let i = 0; i < assets.length; i++) {
        if (assets[i].isCharacter) {
            DibujarAvatares(i, assets[i].x, assets[i].y, assets[i].imagenUrl);
        }
    }

    DibujarMensaje("Seleciona tus 3 personajes", 500, 500);
    DibujarBotones(6);
}
function actualizar() {


    for (i = 0; i < equipoPelea.length; i++) {

        const ID = assets.findIndex((asset) => asset.nombre === equipoPelea[i].nombre);

        if (assets[ID].avatar.EstoyMuerto) { DibujarAvatares(ID, assets[ID].x, assets[ID].y, assets[ID].deadImagenUrl); }
        else { DibujarAvatares(ID, assets[ID].x, assets[ID].y, assets[ID].imagenUrl); }
    }

}
function MenuObtion() {
    accion = "Mostrar";
    assets[9].clicked = true;

    const Team1 = Verificacion(equipoPelea.slice(0, 3));
    const Team2 = Verificacion(equipoPelea.slice(3, 6));

    if (Team1 == Team2) {

        console.log("El juego continua")

        turno++;

        if (turno > 5) { turno = 0; }

        while (equipoPelea[turno].HP <= 0) {
            turno++;
            if (turno > 5) { turno = 0; }
        }

        if (equipoPelea[turno].estado[0] > 0) {

            actualizar();
            DibujarMensaje(equipoPelea[turno].nombre + " esta " + equipoPelea[turno].estado[1], 600, 500);
            DibujarBotones(9)
            equipoPelea[turno].estado[0] -= 1;



        }
        else {
            mensaje2 = " ";

            actualizar()
            DibujarMensaje("Turno de " + equipoPelea[turno].nombre, 600, 500)
            DibujarBotones(7)
            DibujarBotones(8)
        }

    } else {
        console.log("fin del juego")

        if (Team1 == 1) { console.log("Team 1 gana"); GameOver(1) }
        else { console.log("Team 2 gana"); GameOver(2) }

    }

}



//Funciones de dibujado     de avatares
function MostrarStats(url, x, y) {
    const img = new Image();
    img.src = url;

    img.onload = function () {
        ctx.drawImage(img, x, y, 150, 200)
    }

}
function DibujarAvatares(id, x, y, url) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const Imagen = new Image()
    Imagen.src = url


    Imagen.onload = function () {

        ctx.drawImage(Imagen, x, y, 150, 200)

        //Cuadros
        ctx.fillStyle = 'green';
        ctx.fillRect(x + 1, y + 215, 150, 20);
        ctx.fillStyle = 'blue';
        ctx.fillRect(x + 1, y + 235, 150, 20);

        ctx.font = '14px Rockwell';
        ctx.fillStyle = 'white';
        ctx.fillText("HP:" + assets[id].avatar.HP, x + 50, y + 230);//Hp
        ctx.fillText("MP:" + assets[id].avatar.MP, x + 50, y + 250);//MP

    }

}


//funciones de dibujo de pantalla
function DibujarMensaje(mensaje, x, y) {

    {//recuadro del menu
        ctx.fillStyle = 'rgba(85, 81, 95, 0.447)';
        ctx.strokeStyle = '#30108a';
        ctx.lineWidth = 5;

        const x = 160;
        const y = 430;
        const width = 1180;
        const height = 220;
        const borderRadius = 20;

        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
        ctx.lineTo(x + borderRadius, y + height);
        ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
    }
    ctx.font = '35px Rockwell';
    ctx.fillStyle = 'white';
    ctx.fillText(mensaje, x, y);
    ctx.fillText(mensaje2, 600, 500);

    mensaje2 = "";
}
function DibujarBotones(id) {

    if (assets[id].clicked = true) { assets[id].clicked = false }

    const img = new Image()
    img.src = assets[id].imagenUrl

    img.onload = function () {
        ctx.drawImage(img, assets[id].x, assets[id].y, assets[id].w, assets[id].h)
    }
}


//otros
function Formacion() {

    mensaje2 = " "
    const disponibles = NPCs.filter((npc) => !equipoPelea.includes(npc));

    while (equipoPelea.length < 6 && disponibles.length > 0) {
        const randomIndex = Math.floor(Math.random() * disponibles.length);
        const selectedNPC = disponibles[randomIndex];

        equipoPelea.push(selectedNPC);
        disponibles.splice(randomIndex, 1);

    }
    Pocicionamiento()


}
function Pocicionamiento() {

    for (i = 0; i < equipoPelea.length; i++) {
        let x, y;

        const ID = assets.findIndex((asset) => asset.nombre === equipoPelea[i].nombre);

        if (i == 0) { assets[ID].x = 50; assets[ID].y = 90 }
        else if (i == 1) { assets[ID].x = 250; assets[ID].y = 20 }
        else if (i == 2) { assets[ID].x = 450; assets[ID].y = 90 }
        else if (i == 3) { assets[ID].x = 900; assets[ID].y = 90 }
        else if (i == 4) { assets[ID].x = 1100; assets[ID].y = 20 }
        else if (i == 5) { assets[ID].x = 1300; assets[ID].y = 90 }

    }

    actualizar()

}
function Verificacion(Team) {
    return Team.every((miembro) => miembro.HP === 0) ? 0 : 1;
}


//inicio y final del juego
function GameStart() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    {//recuadro del menu
        ctx.fillStyle = 'rgba(85, 81, 95, 0.447)';
        ctx.strokeStyle = '#210679';
        ctx.lineWidth = 5;

        const x = 500;
        const y = 10;
        const width = 500;
        const height = 640;
        const borderRadius = 20;

        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + width - borderRadius, y);
        ctx.arcTo(x + width, y, x + width, y + borderRadius, borderRadius);
        ctx.lineTo(x + width, y + height - borderRadius);
        ctx.arcTo(x + width, y + height, x + width - borderRadius, y + height, borderRadius);
        ctx.lineTo(x + borderRadius, y + height);
        ctx.arcTo(x, y + height, x, y + height - borderRadius, borderRadius);
        ctx.lineTo(x, y + borderRadius);
        ctx.arcTo(x, y, x + borderRadius, y, borderRadius);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();
    }

    console.log("Inicia el juego")

    for (i = 0; i <= 5; i++) { assets[i].isShowingStats = false; }

    ctx.font = '35px Rockwell';
    ctx.fillStyle = 'white';
    ctx.fillText("YU.GI.OH  UDC", 630, 150);

    ctx.font = '20px Rockwell';
    ctx.fillText("By:Kmilo", 710, 640);

    equipoPelea = [];
    turno = -1;
    accion = "Mostrar";
    mensaje = "";
    mensaje2 = "";

    NPCs.forEach(avatar => avatar.reset())
    assets.forEach(avatar => avatar.reset())

    DibujarBotones(11);



}
function GameOver(Team) {


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let x = 0;
    let mensaje = "Equipo 1";

    if (Team == 2) {
        x = 3;
        mensaje = "Equipo 2";
    }

    for (i = x; i <= x + 2; i++) {
        const ID = assets.findIndex((asset) => asset.nombre === equipoPelea[i].nombre);

        if (i == x) { assets[ID].x = 480; assets[ID].y = 80 }
        else if (i == x + 1) { assets[ID].x = 680; assets[ID].y = 80 }
        else if (i == x + 2) { assets[ID].x = 880; assets[ID].y = 80 }
    }

    for (i = x; i <= x + 2; i++) {
        const ID = assets.findIndex((asset) => asset.nombre === equipoPelea[i].nombre);

        if (assets[ID].avatar.EstoyMuerto) { DibujarAvatares(ID, assets[ID].x, assets[ID].y, assets[ID].deadImagenUrl); }
        else { DibujarAvatares(ID, assets[ID].x, assets[ID].y, assets[ID].imagenUrl); }
    }
    mensaje2 = "";
    DibujarMensaje(mensaje + " win", 630, 500);
    DibujarBotones(10)
}

//controlador de clik
canvas.addEventListener('click', function (event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;

    for (const asset of assets) {
        if (!asset.clicked && x >= asset.x && x <= asset.x + asset.w && y >= asset.y && y <= asset.y + asset.h) {


            asset.evento();



        }
    }




});



GameStart()
