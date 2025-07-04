import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full bg-white">
      <main>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="LSSD Community"
              src="https://images-ext-1.discordapp.net/external/7luFtzoz0sP5ti_UQg3VcW2wuPAiKnwRagYp22OeVII/%3Fsize%3D256/https/cdn.discordapp.com/icons/1281596185102258246/ade033f6aa026c0100098168b0404193.png"
              className="mx-auto h-30 w-auto rounded-full"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Connectez-vous à votre compte
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="pseudo" className="block text-sm/6 font-medium text-gray-900">
                  Pseudonyme
                </label>
                <div className="mt-2">
                  <input
                    id="pseudo"
                    name="pseudo"
                    type="text"
                    required
                    autoComplete="current-pseudo"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Mot de passe
                  </label>
                  <div className="text-sm">
                    <a href="https://discord.com/channels/1281596185102258246/1370397028483338321" className="font-semibold text-indigo-600 hover:text-indigo-500">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Se connecter
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Vous n'avez pas de compte ?{' '}
              <Link href="/create-account" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
