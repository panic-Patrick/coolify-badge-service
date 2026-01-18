import LoginForm from "./ui/LoginForm";

type SearchParams = { redirect?: string } | Promise<{ redirect?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const redirect = params?.redirect || "/";
  return <LoginForm redirect={redirect} />;
}
