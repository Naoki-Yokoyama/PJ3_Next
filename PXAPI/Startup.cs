﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using static PXLIB.PXCL_stc;

namespace PXAPI
{
    public class Startup
    {
        public static IConfigurationRoot Configuration { get; private set; }

        public Startup(IConfiguration configuration)
        {
            Configuration = (IConfigurationRoot)configuration;
        }

        public Startup(IHostingEnvironment env)
        {
            // appsettings.jsonファイルの読み込み
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // AppSettings取得時エラーの場合は「ErrCode:PXERR201」発生（ここか？）
            services.Configure<PXAS_AppSetCL>(Configuration.GetSection("PXAS_AppSetCL"));
            services.AddMvc();

            // appsettings.jsonで設定したKeyValueをエンティティにバインド            
            //services.Configure<AppSettingsConfig>(Configuration.GetSection("AppSettings"));

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseBrowserLink();
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "api/{controller=Login}/{action=PrepareLogin}/{id=2}");
            });
        }
    }
}
