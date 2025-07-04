import { fetchWithAuth } from "./auth";

export async function fetchAllCharacters(): Promise<any[]> {
  const response = await fetchWithAuth('/characters/');
  if (!response.ok) {
    throw new Error(`Failed to fetch characters: ${response.statusText}`);
  }
  const data = await response.json();
  return data || [];
}


interface User {
    username: string;
    firstname: string;
    lastname: string;
}

export async function getCharactersForSpecificUser(user: User): Promise<any[]> {
    const characters = await fetchAllCharacters();
    const matchingCharacters = characters.filter(
        (char: any) => char.firstname === user.firstname && char.lastname === user.lastname
    );
    const discordUserIds = new Set(matchingCharacters.map((char: any) => char.discord_user_id));
    return characters.filter((char: any) => discordUserIds.has(char.discord_user_id));
}


export function getGradeName(grade: number): string {
    switch (grade) {
        case 1:
            return 'Adjoint stagiaire';
        case 2:
            return 'Adjoint';
        case 3:
            return 'Adjoint (bonus I)';
        case 4:
            return 'Adjoint (bonus II)';
        case 5:
            return 'Adjoint (MFTO)';
        case 6:
            return 'Sergent';
        case 7:
            return 'Lieutenant';
        case 8:
            return 'Capitaine';
        case 9:
            return 'Commandant';
        case 10:
            return 'Chef';
        default:
            return 'Bénévole';
    }
}


