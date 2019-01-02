import _ from 'lodash';
import './style.css';

import {init, animate} from './module/lottery'
// import { getAward } from './module/api/api'
// const lottery = require('./js/lottery')

var ready = require('document-ready')

var gallery = blueimp.Gallery([
  'img/spl_duozhu.jpeg',
  'img/spl_max_01.jpeg',
  'img/spl_max_02.jpeg',
  'img/spl_max_03.jpeg',
  'img/spl_qiwei_01.png',
  'img/spl_qiwei_02.png',
  'img/spl_xjj_01.jpeg',
  'img/spl_xjj_02.jpeg',
  'img/spl_xjj_03.jpeg'
], {
  container: '#blueimp-image-carousel',
  carousel: true,
  slideshowInterval: 3000,
  stretchImages: true
});

ready(() => {
  init()
})