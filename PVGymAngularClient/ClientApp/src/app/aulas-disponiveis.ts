export class AulaDisponivel {
  id: number;
  name: string;
  description: string;
  limit: number;
  duration: number;
  image: string;

  constructor(id: number, name: string, description: string, limit: number, duration: number, image: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.limit = limit;
    this.duration = duration;
    this.image = image;
  }
}
