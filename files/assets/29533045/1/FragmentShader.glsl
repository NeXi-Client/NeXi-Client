#ifdef MAPCOLOR
uniform vec3 material_diffuse;
#endif

#ifdef MAPTEXTURE
uniform sampler2D texture_diffuseMap;
#endif

uniform sampler2D redTexture;
uniform sampler2D blueTexture;
uniform sampler2D greenTexture;

uniform vec2 redScale;
uniform vec2 blueScale;
uniform vec2 greenScale;

void getAlbedo() {
    dAlbedo = vec3(1.0);
    
    vec3 baseTexture = texture2DSRGB(texture_diffuseMap, $UV).$CH;
    
    vec3 red   = texture2DSRGB(redTexture, $UV * redScale).$CH;
    vec3 blue  = texture2DSRGB(blueTexture, $UV * blueScale).$CH;
    vec3 green = texture2DSRGB(greenTexture, $UV * greenScale).$CH;
    
    dAlbedo = red * baseTexture.r + green * baseTexture.g + blue * baseTexture.b;
    
    #ifdef MAPVERTEX
        dAlbedo *= gammaCorrectInput(saturate(vVertexColor.$VC));
    #endif
}