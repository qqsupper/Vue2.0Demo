const path = require('path');//设置路径
const HTMLPlugin=require('html-webpack-plugin');//承载html容器
const webpack=require('webpack');

const isDev=process.env.NODE_ENV ==="development"   //判断加载进来的是否是开发环境




const config = {
    target:'web',//开发编译目标是web平台
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.vue$/, //检测vue文件
                loader: 'vue-loader' //因为webpack支持ES5语法，需要调用vue-loader去解析
            },
            {
                test:/.\jsx/, //检测vue的js文件
                loader:"babel-loader"
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', //将css内容写到指定js或者html页面里
                    'css-loader'   //将文件从css里面读取出来
                ]
            },
            {
                test:/\.styl/,
                use:[
                    'style-loader',
                    'css-loader',
                    {
                        loader:'postcss-loader',//添加postcss平台后处理器，如插件autoprefixer
                        options:{
                            sourceMap:true //如果stylus-loader生成sourceMap，则自己不生成，如果前者没生成，则自己生成
                        }
                    },
                    'stylus-loader' //先从底部，然后一层层向上提交
                ]
            },
            {
                test:/\.(gif|png|jpg|jpeg)$/,
                use:[
                    {
                        loader:'url-loader',//将图片打包成base64到页面
                        options:{
                            limit:1024, //图片大于1024个字节
                            name:'[name]-aaa.[ext]' //指定文件输出的名字
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:isDev?'"development"':'"production"'
            }
        }),//插件判断环境变量
        new HTMLPlugin() //生成承载html容器
    ]
}

if(isDev){
    //配置服务器
    config.devtool="#cheap-module-eval-source-map"
    config.devServer={
        port:8000,
        host:'0.0.0.0',
        overlay:{
            errors:true //报错信息写在页面
        },
        hot:true //热加载
    };
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}




module.exports=config