export interface UserProps {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export default class User {
  private props: UserProps;

  constructor(props: UserProps) {
    this.validate(props);
    this.props = props;
  }

  getId(): string {
    return this.props.id;
  }

  getName(): string {
    return this.props.name;
  }

  getEmail(): string {
    return this.props.email;
  }

  getCreatedAt(): Date {
    return this.props.createdAt;
  }

  getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  private validate(props: UserProps): void {
    if (!props.id || props.id.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }

    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    if (props.name.length > 100) {
      throw new Error('Name cannot exceed 100 characters');
    }

    this.validateEmail(props.email);
  }

  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (email.length > 255) {
      throw new Error('Email cannot exceed 255 characters');
    }
  }
}
