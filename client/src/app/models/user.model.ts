export interface IUser {
    /**
     * @roles:
     *   employee,
     *   employer
     */
    idUser: string,
    role: string, // see @roles
	nameFirst: string,
	nameLast: string,
	age: number,
	skill: {
		level: number,
        name: string
	}
}

export class User implements IUser {
    idUser: string;
    role: string;
	nameFirst: string;
	nameLast: string;
	age: number;
	skill: {
		level: number,
        name: string
	}

    constructor(
        idUser?: string,
        role?: string,
        nameFirst?: string,
        nameLast?: string,
        age?: number,
        skill?: {
            level?: number,
            name?: string
        }
    ) {
        this.idUser = idUser || '';
        this.role = role || '';
        this.nameFirst = nameFirst || '';
        this.nameLast = nameLast || '';
        this.age = age || 18;
        this.skill = {
            level: skill.level || 1,
            name: skill.name || ''
        };
    }
}