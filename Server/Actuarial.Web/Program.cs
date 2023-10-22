using Actuarial.Domain.Identity;
using Actuarial.Infrastructure.Repo.Classes;
using Actuarial.Infrastructure.Repo.Data;
using Actuarial.Infrastructure.Repo.Interfaces;
using Actuarial.Infrastructure.Services.Classes;
using Actuarial.Infrastructure.Services.Interfaces;
using Actuarial.Web.Extensions;
using Actuarial.Web.Init;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

ServiceExtensions.RegisterServices(builder.Services);
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme
   ).AddCookie(options => { options.LoginPath = "/Account/Login"; });




builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromDays(100);//You can set Time   
});

builder.Services.AddMvc(options => options.MaxModelValidationErrors = 50)
    .AddRazorPagesOptions(options =>
    {

        options.Conventions.AllowAnonymousToPage("/Home/Login");
    });
builder.Services.AddScoped<ViewRender, ViewRender>();

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("SQLConnectionString") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddIdentity<User,Role>(options => options.SignIn.RequireConfirmedAccount = false)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddTransient(typeof(IUnitOfWork), typeof(UnitOfWork));
builder.Services.AddTransient(typeof(IEmpServcies), typeof(EmpServcies));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Account}/{action=Login}/{id?}");
app.MapRazorPages();
using (var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
{
    using (var context = serviceScope.ServiceProvider.GetService<ApplicationDbContext>())
    {
        try
        {
            context?.Database.Migrate();
        }
        catch (Exception)
        {
            // Ignore
        }

        try
        {
            SeedDataInDatabase.SeedData(serviceScope.ServiceProvider).Wait();
        }
        catch (Exception)
        {
            // Ignore
        }
    }
}
app.Run();
