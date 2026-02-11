using Microsoft.Extensions.Logging;
using MercadoApp.Services;

namespace MercadoApp;

public static class MauiProgram
{
	/// <summary>URL base da API. No emulador Android use http://10.0.2.2:5000</summary>
	public static string ApiBaseUrl { get; } =
#if ANDROID
		"http://10.0.2.2:5000";
#else
		"http://localhost:5000";
#endif

	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

		builder.Services.AddSingleton<HttpClient>(sp =>
		{
			var client = new HttpClient { BaseAddress = new Uri(ApiBaseUrl.TrimEnd('/') + "/") };
			client.DefaultRequestHeaders.Add("Accept", "application/json");
			return client;
		});
		builder.Services.AddSingleton<ProdutoApiService>();

		builder.Services.AddTransient<Pages.ListaProdutosPage>();
		builder.Services.AddTransient<Pages.AddProdutoPage>();
		builder.Services.AddTransient<Pages.EditProdutoPage>();

#if DEBUG
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
