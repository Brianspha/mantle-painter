import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import swal from "sweetalert2";
import { MANTLE_PAINTER_ABI,TOKEN_CONTRACT_ABI } from "../utils";
const Web3EthContract = require('web3-eth-contract');

Vue.use(Vuex);
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    mantlePainterAddress:process.env.VUE_APP_MANTLE_PAINTER_ADDRESS,
    tokenContractAddress:process.env.VUE_APP_TOKEN_CONTRACT_ADDRESS,
    Web3EthContract:Web3EthContract,
    tokenContract:{},
    mantleContract:{},
    MANTLE_PAINTER_ABI:MANTLE_PAINTER_ABI,
    TOKEN_CONTRACT_ABI:TOKEN_CONTRACT_ABI,
    etherConverter: require("ether-converter"),
    utils: require("web3-utils"),
    connected: false,
    currentPixelPage: 1,
    currentPixelMaxStake: (Math.random() * 100).toFixed(7),
    currentPixelBalance: (Math.random() * 40).toFixed(7),
    totalStaked: 0,
    isLoading: false,
    showPixelDialog: false,
    primaryColor: "purple darken-2",
    pickerColor: "",
    currentPixel: {},
    selectedPixelID: 0,
    board: [],
    grid: {},
    boardOwned: [],
    gridOwned: {},
    loadingZIndex: 0,
    userAddress: "",
    selectedQaudrantStart: 0,
    revision:1
  },
  plugins: [createPersistedState()],
  modules: {},
  actions: {
    getSkyData: async function() {
    
    },
    saveData: async function(context, data) {
    
    },
    success(_context, message) {
      swal.fire({
        position: "top-end",
        icon: "success",
        title: "Success",
        showConfirmButton: false,
        timer: 2500,
        text: message,
      });
    },
    warning(_context, message) {
      swal.fire("Warning", message.warning, "warning").then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          message.onTap();
        }
      });
    },
    error(_context, message) {
      console.log("shwoing error message: ", message.error);
      swal.fire("Error!", message.error, "error").then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          console.log("leveled");
        }
      });
    },
    successWithFooter(_context, message) {
      swal.fire({
        icon: "success",
        title: "Success",
        text: message.message,
        footer: `<a href= https://testnet.bscscan.com/tx/${message.txHash}> View on Etherscan</a>`,
      });
    },
    errorWithFooterMetamask(_context, message) {
      swal.fire({
        icon: "error",
        title: "Error!",
        text: message,
        footer: `<a href= https://metamask.io> Download Metamask</a>`,
      });
    },
  },
});

export default store;
