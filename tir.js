var tirShader;

function initTirShader() {
    tirShader = initShaders("tir-vs","tir-fs");
    
    // active ce shader
    gl.useProgram(tirShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    tirShader.vertexPositionAttribute = gl.getAttribLocation(tirShader, "aVertexPosition");
    gl.enableVertexAttribArray(tirShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    tirShader.vertexCoordAttribute = gl.getAttribLocation(tirShader, "aVertexCoord");
    gl.enableVertexAttribArray(tirShader.vertexCoordAttribute);

     // adresse de la variable uniforme uOffset dans le shader
    tirShader.positionUniform = gl.getUniformLocation(tirShader, "uPosition");
}

function Tir() {
    this.initParameters();

    // cree un nouveau buffer sur le GPU et l'active
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    // un tableau contenant les positions des sommets (sur CPU donc)
    var wo2 = 0.5*this.width;
    var ho2 = 0.5*this.height;

    var vertices = [
        -wo2,-ho2, -0.5,
         wo2,-ho2, -0.5,
         wo2, ho2, -0.5,
        -wo2, ho2, -0.5
    ];

    // on envoie ces positions au GPU ici (et on se rappelle de leur nombre/taille)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;
        
    // meme principe pour les couleurs
    this.coordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    var coords = [
         0.0, 0.0, 
         1.0, 0.0, 
         1.0, 1.0, 
         0.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    this.coordBuffer.itemSize = 2;
    this.coordBuffer.numItems = 4;
    
    // creation des faces du cube (les triangles) avec les indices vers les sommets
    this.triangles = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    var tri = [0,1,2,0,2,3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;
}

Tir.prototype.initParameters = function() {
    this.width = 0.05;
    this.height = 0.2;
    this.position = [0.0, -0.5];
    this.etat = 0;
    this.texture = null;
}

Tir.prototype.setParameters = function(elapsed) {
    switch (this.etat){
        case 0:
            this.deplacer(elapsed);
            break;
        case 1:
            this.toucher(elapsed);
            break;
    }
}

Tir.prototype.deplacer = function(elapsed){
    this.position[1] += elapsed/1000 * 1.1;
}

Tir.prototype.toucher = function(elapsed){

}

Tir.prototype.getPosition = function(elapsed){
    return this.position;
}

Tir.prototype.setPosition = function(x,y) {
    this.position = [x,y];
}

Tir.prototype.shader = function() {
    return tirShader;
}

Tir.prototype.sendUniformVariables = function() {
    gl.uniform2fv(tirShader.positionUniform,this.position);
}

Tir.prototype.draw = function() {
    // active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(tirShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // active le buffer de coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.vertexAttribPointer(tirShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // dessine les buffers actifs
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
}


