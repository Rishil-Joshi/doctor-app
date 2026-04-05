import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from '@/components/FormField';

describe('FormField', () => {
  const defaultProps = {
    label: 'Username',
    value: '',
    onChange: jest.fn(),
    placeholder: 'Enter username',
  };

  it('renders the label and input', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  it('renders with the provided value', () => {
    render(<FormField {...defaultProps} value="drsmith" />);
    expect(screen.getByDisplayValue('drsmith')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const onChange = jest.fn();
    render(<FormField {...defaultProps} onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText('Enter username'), 'a');
    expect(onChange).toHaveBeenCalled();
  });

  it('renders the error message when provided', () => {
    render(<FormField {...defaultProps} error="Username is required" />);
    expect(screen.getByText('Username is required')).toBeInTheDocument();
  });

  it('applies red border class when error is present', () => {
    render(<FormField {...defaultProps} error="Required" />);
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toHaveClass('border-red-500');
  });

  it('does not render an error message when error is absent', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.queryByText('Username is required')).not.toBeInTheDocument();
  });

  it('renders helper text when provided', () => {
    render(<FormField {...defaultProps} helperText="Must be at least 3 characters" />);
    expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
  });

  it('renders as password type when specified', () => {
    render(<FormField {...defaultProps} type="password" placeholder="Enter password" />);
    expect(screen.getByPlaceholderText('Enter password')).toHaveAttribute('type', 'password');
  });
});
