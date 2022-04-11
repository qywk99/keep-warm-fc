const core = require("@serverless-devs/core");
const path = require("path");
const { lodash, Logger, loadComponent } = core;
const logger = new Logger("keep-warm-fc");

/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数 {url: 请求的url, interval: 请求的频率（默认2m）, enable: true}
 * @return inputs
 */

module.exports = async function index(inputs, args = {}) {
  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);
  if (lodash.isEmpty(args.url)) {
    throw new Error("missing url parameter in keep-warm-fc plugin.");
  }
  const instance = await loadComponent("devsapp/fc");
  const newInputs = lodash.assign({}, inputs, {
    props: {
      region: lodash.get(inputs, "props.region"),
      service: lodash.get(inputs, "props.service"),
      function: {
        name: "keep-warm",
        description: "Serverless Devs Web Framework Helper Function",
        codeUri: path.join(__dirname, "helper"),
        runtime: "python3",
        timeout: 1,
        memorySize: 128,
        instanceConcurrency: 1,
        environmentVariables: {
          KEEP_WARM_FC_URL: args.url,
        },
      },
      triggers: [
        {
          name: "timerTrigger",
          type: "timer",
          config: {
            payload: "{}",
            cronExpression: `@every ${lodash.get(args, "interval", "2m")}`,
            enable: lodash.isUndefined(args.enable) ? true : args.enable,
          },
        },
      ],
    },
  });
  await instance.deploy(newInputs);
  await instance.invoke(
    lodash.assign({}, newInputs, {
      args: "",
      argsObj: [],
    })
  );
  return inputs;
};
