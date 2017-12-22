import * as THREE from 'three';

var DEFAULT_LIGHT_MAP_INTENSITY = 1.2;
var DEFAULT_LIGHT_MAP_EXPOSURE = 0.6;
var DEFAULT_LIGHT_MAP_FALLOFF = 0;
var DEFAULT_NORMAL_MAP_FACTOR = new THREE.Vector2(0.8, 0.8);

function Io3dMaterial(params) {
    THREE.ShaderMaterial.call(this, params);

    var params = params || {};
    this.lightMapExposure =
        params.lightMapExposure || DEFAULT_LIGHT_MAP_EXPOSURE;
    this.lightMapFalloff = params.lightMapFalloff || DEFAULT_LIGHT_MAP_FALLOFF;

    this.uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib.lights,
        THREE.UniformsLib.shadowmap,
        {
            color: {
                value: params.color || new THREE.Color(1.0, 1.0, 1.0)
            },
            map: { value: params.map || null },
            specularMap: { value: params.specularMap || null },
            alphaMap: { value: params.alphaMap || null },
            lightMap: { value: params.lightMap || null },
            lightMapIntensity: {
                value: params.lightMapIntensity || DEFAULT_LIGHT_MAP_INTENSITY
            },
            lightMapFalloff: {
                value: params.lightMapFalloff || DEFAULT_LIGHT_MAP_FALLOFF
            },
            lightMapExposure: {
                value: params.lightMapExposure || DEFAULT_LIGHT_MAP_EXPOSURE
            },
            normalMap: { value: params.normalMap || null },
            normalScale: {
                value: params.normalScale || DEFAULT_NORMAL_MAP_FACTOR
            },
            shininess: { value: params.shininess || 1.0 },
            specular: {
                value: params.specular || new THREE.Color(0.25, 0.25, 0.25)
            },
            emissive: {
                value: params.emissive || new THREE.Color(0.0, 0.0, 0.0)
            },
            opacity: { value: params.opacity || 1 },
            offsetRepeat: {
                value: params.offsetRepeat || new THREE.Vector4(0, 0, 1, 1)
            }
        }
    ]);

    this.vertexShader = `varying vec3 vViewPosition;
        
        #ifndef FLAT_SHADED
            varying vec3 vNormal;
        #endif
        
        #include <uv_pars_vertex>
        #include <uv2_pars_vertex>
        #include <shadowmap_pars_vertex>
        
        void main()
        {
        //  vUv = uv;
          #include <uv_vertex>
          #include <uv2_vertex>
        
          #include <beginnormal_vertex>
          #include <defaultnormal_vertex>
        
          #ifndef FLAT_SHADED
            // Normal computed with derivatives when FLAT_SHADED
              vNormal = normalize( transformedNormal );
          #endif
        
          #include <begin_vertex>
          #include <project_vertex>
        
          vViewPosition = - mvPosition.xyz;
        
          #include <worldpos_vertex>
          #include <shadowmap_vertex>
        
        }`;
    this.fragmentShader = `uniform vec3 color;
        uniform vec3 emissive;
        uniform vec3 specular;
        uniform float shininess;
        uniform float opacity;
        
        #include <common>
        #include <packing>
        #include <uv_pars_fragment>
        #include <uv2_pars_fragment>
        #include <map_pars_fragment>
        #include <alphamap_pars_fragment>
        
        // Replaces <lightmap_pars_fragment>;
        
        #ifdef USE_LIGHTMAP
            uniform sampler2D lightMap;
            uniform float lightMapIntensity;
            uniform float lightMapExposure;
            uniform float lightMapFalloff;
        #endif
        
        #include <normalmap_pars_fragment>
        #include <specularmap_pars_fragment>
        
        #include <bsdfs>
        #include <lights_pars>
        #include <lights_phong_pars_fragment>
        #include <shadowmap_pars_fragment>
        
        
        void main() {
        
            vec4 diffuseColor = vec4( color, opacity );
            ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
        
            vec3 totalEmissiveRadiance = emissive;
        
            #include <map_fragment>
            #include <alphamap_fragment>
            #include <alphatest_fragment>
            #include <specularmap_fragment>
        
            // Start of <normal_fragment> replace block
            #ifdef FLAT_SHADED
        
              // Workaround for Adreno/Nexus5 not able able to do dFdx( vViewPosition ) ...
        
              vec3 fdx = vec3( dFdx( vViewPosition.x ), dFdx( vViewPosition.y ), dFdx( vViewPosition.z ) );
              vec3 fdy = vec3( dFdy( vViewPosition.x ), dFdy( vViewPosition.y ), dFdy( vViewPosition.z ) );
              vec3 normal = normalize( cross( fdx, fdy ) );
        
            #else
        
              vec3 normal = normalize( vNormal );
        
              #ifdef DOUBLE_SIDED
        
                normal = normal * ( float( gl_FrontFacing ) * 2.0 - 1.0 );
        
              #endif
        
            #endif
        
            #ifdef USE_NORMALMAP
        
              normal = perturbNormal2Arb( -vViewPosition, normal );
        
            #elif defined( USE_BUMPMAP )
        
              normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );
        
            #endif
            // End of <normal_fragment> replace block
        
            // accumulation
            #include <lights_phong_fragment>
        
            // Start of <light-template> replace block
            GeometricContext geometry;
        
            geometry.position = - vViewPosition;
            geometry.normal = normal;
            geometry.viewDir = normalize( vViewPosition );
        
            IncidentLight directLight;
        
            #if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
        
                PointLight pointLight;
        
                for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
        
                    pointLight = pointLights[ i ];
        
                    getPointDirectLightIrradiance( pointLight, geometry, directLight );
        
                    #ifdef USE_SHADOWMAP
                    directLight.color *= all( bvec2( pointLight.shadow, directLight.visible ) ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ] ) : 1.0;
                    #endif
        
                    RE_Direct( directLight, geometry, material, reflectedLight );
        
                }
        
            #endif
        
            #if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
        
                SpotLight spotLight;
        
                for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
        
                    spotLight = spotLights[ i ];
        
                    getSpotDirectLightIrradiance( spotLight, geometry, directLight );
        
                    #ifdef USE_SHADOWMAP
                    directLight.color *= all( bvec2( spotLight.shadow, directLight.visible ) ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;
                    #endif
        
                    RE_Direct( directLight, geometry, material, reflectedLight );
        
                }
        
            #endif
        
            #if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
        
                DirectionalLight directionalLight;
        
                for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
        
                    directionalLight = directionalLights[ i ];
        
                    getDirectionalDirectLightIrradiance( directionalLight, geometry, directLight );
        
                    #ifdef USE_SHADOWMAP
                    directLight.color *= all( bvec2( directionalLight.shadow, directLight.visible ) ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
                    #endif
        
                    RE_Direct( directLight, geometry, material, reflectedLight );
        
                }
        
            #endif
        
            #if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
        
                RectAreaLight rectAreaLight;
        
                for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
        
                    rectAreaLight = rectAreaLights[ i ];
                    RE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );
        
                }
        
            #endif
        
            #if defined( RE_IndirectDiffuse )
        
                vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
        
                #ifdef USE_LIGHTMAP
        
                    // compute the light value
                    vec3 unit = vec3(1.0);
                    vec3 light = 2.0 * (texture2D( lightMap, vUv2 ).xyz - lightMapExposure * unit);
                    // compute the light intensity modifier
                    vec3 modifier = -lightMapFalloff * light * light + unit;
                    // apply light
                    vec3 lightMapIrradiance = light * modifier * lightMapIntensity;
        
                    #ifndef PHYSICALLY_CORRECT_LIGHTS
        
                        lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage
        
                    #endif
        
                    irradiance += lightMapIrradiance;
        
                #endif
        
                #if ( NUM_HEMI_LIGHTS > 0 )
        
                    for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
        
                        irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry );
        
                    }
        
                #endif
        
                RE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );
        
            #endif
            // End of <light-template> replace block
        
            vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
        
            gl_FragColor = vec4( outgoingLight, diffuseColor.a );
        
        }`;
    this.lights = true;
}

Io3dMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
Io3dMaterial.prototype.constructor = Io3dMaterial;

export default Io3dMaterial;
