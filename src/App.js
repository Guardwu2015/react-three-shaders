import React, { Component } from 'react';
import * as THREE from 'three';
//import logo from './logo.svg';
import './App.css';

import Scene from './components/Scene/Scene';
import Stats from './components/Stats/Stats';
import Controls from './components/Controls/Controls';
import CodeView from './components/CodeView/CodeView';

import basicColor from './shaders/BasicColor';
import basicColorLights from './shaders/BasicColorLights';
import checker from './shaders/Checker';
import dots from './shaders/Dots';
import simpleLines from './shaders/SimpleLines';
import fadedLines from './shaders/FadedLines';
import starburst from './shaders/Starburst';
import matrix from './shaders/Matrix';
import normal from './shaders/Normal';
import voronoise from './shaders/Voronoise';
import woodGrain from './shaders/WoodGrain';
import simplexNoise3D from './shaders/SimplexNoise3D';
import perlinNoise3D from './shaders/PerlinNoise3D';
import perlinVertexDisp from './shaders/PerlinVertexDisp';
import polkaNoise from './shaders/PolkaNoise';
import fresnel2Color from './shaders/Fresnel2Color';

class App extends Component {
  constructor(props) {
    super(props);
    this.shaders = [
      basicColor,
      basicColorLights,
      checker,
      dots,
      simpleLines,
      fadedLines,
      starburst,
      normal,
      matrix,
      voronoise,
      woodGrain,
      simplexNoise3D,
      perlinNoise3D,
      perlinVertexDisp,
      polkaNoise,
      fresnel2Color
    ];
    this.shapes = [
      { name: 'Cube', class: 'BoxGeometry', args: [200, 200, 200, 50, 50, 50] },
      { name: 'Sphere', class: 'SphereGeometry', args: [150, 32, 32] },
      {
        name: 'Cylinder',
        class: 'CylinderGeometry',
        args: [100, 100, 200, 32, 100]
      },
      {
        name: 'Torus Knot',
        class: 'TorusKnotGeometry',
        args: [100, 30, 100, 16]
      }
    ];
    this.state = {
      currentShader: {},
      currentShaderObject: {},
      currentShape: this.shapes[0],
      showCode: false
    };
    this.clock = new THREE.Clock();
    this.threeVersion = THREE.REVISION;
    this.reactVersion = React.version;
  }

  componentDidMount() {
    this.setShaderFromName('Basic Color');
  }

  getShaderFromName(name) {
    return this.shaders.find(x => x.name === name);
  }

  getShapeFromName(name) {
    return this.shapes.find(x => x.name === name);
  }

  setShaderFromName(name) {
    let shader = this.getShaderFromName(name);
    //create the options object to send to ShaderMaterial.
    let shaderObject = {
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      lights: true
    };
    // Add uniforms if present.
    if ('uniforms' in shader) {
      // Using UniformUtils will clone the shader files uniforms,
      shaderObject.uniforms = THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        shader.uniforms
      ]);
    }
    // Set this new material on the mesh.
    let material = new THREE.ShaderMaterial(shaderObject);
    // add the original uniforms here so we can loop over them in the Controls, because other uniforms are added that we don't want controls for.
    material.customUniforms = shader.uniforms;

    this.setState({ currentShader: material, currentShaderObject: shader });
  }

  animateCallback() {
    // if the selects shader has an update function, call it.
    if (
      Boolean(this.state.currentShaderObject) &&
      Boolean(this.state.currentShaderObject.update)
    ) {
      this.state.currentShaderObject.update(
        this.state.currentShader.uniforms,
        this.clock
      );
    }
  }

  changeShape(shapeName) {
    this.setState({ currentShape: this.getShapeFromName(shapeName) });
  }

  showCode(show = false) {
    this.setState({ showCode: show });
  }

  render() {
    return (
      <div className="App">
        <Scene
          currentShape={this.state.currentShape}
          currentShader={this.state.currentShader}
          onAnimate={() => {
            this.animateCallback();
          }}
          ref={scene => {
            this.scene = scene;
          }}
        />
        <Stats />
        <Controls
          shapes={this.shapes}
          onShapeSelect={shapeName => {
            this.changeShape(shapeName);
          }}
          shaders={this.shaders}
          currentShader={this.state.currentShader}
          onShaderSelect={shaderName => {
            //this.setShader(shader);
            this.setShaderFromName(shaderName);
          }}
          codeButtonClick={() => {
            this.showCode(true);
          }}
        />
        <div id="info">
          Three.js ShaderMaterial experiments.<br />
          Originals at{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://2pha.com/blog/experimenting-threejs-shaders-and-shadermaterial/"
          >
            this blog post
          </a>
          <br />
          Build with Three.js ({this.threeVersion}) and React.js ({
            this.reactVersion
          })<br />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/2pha/react-three-shaders"
          >
            https://github.com/2pha/react-three-shaders
          </a>
        </div>
        <CodeView
          visible={this.state.showCode}
          shaderName={this.state.currentShaderObject.name || ''}
          onBorderClick={() => {
            this.showCode(false);
          }}
          vertexShader={this.state.currentShaderObject.vertexShader || ''}
          fragmentShader={this.state.currentShaderObject.fragmentShader || ''}
        />
      </div>
    );
  }
}

export default App;
