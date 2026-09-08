import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginPageProps {
  onSignIn: () => void;
  errorMessage?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ onSignIn, errorMessage }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>FixIt - Team Task Tracker</CardTitle>
        <CardDescription>Sign in to manage team tasks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}
        <Button className="w-full" onClick={onSignIn}>
          Sign in with Google
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
