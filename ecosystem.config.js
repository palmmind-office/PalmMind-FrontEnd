module.exports = [
    {
      script: "./bin/www",
      name: "app",
      exec_mode: "cluster",
      instances: 1
    }
  ];
  
  //pm2-runtime ecosystem.config.js --env development