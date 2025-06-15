
const News = () => {
  return (
    <div className="container py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Noticias</h1>
        <p className="mt-4 text-lg text-muted-foreground">Mantente al día con las últimas novedades, eventos y logros de la comunidad START.</p>
      </div>

      <div className="mt-12">
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-lg">Aún no hay noticias. ¡Vuelve pronto!</p>
        </div>
      </div>
    </div>
  );
};

export default News;

