namespace MercadoApp;

public static class AppServiceProvider
{
    public static T GetRequiredService<T>() where T : class
    {
        var services = Application.Current?.Handler?.MauiContext?.Services;
        return services?.GetRequiredService<T>() ?? throw new InvalidOperationException("Serviço não disponível.");
    }
}
