import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SuccessPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-600">
            Thank you for subscribing to ScholarBar. Your account has been upgraded successfully.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>What&apos;s next?</strong> You now have access to all premium features. Start creating unlimited essays and science projects!
            </p>
          </div>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/tools/essay-writer">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                Start Writing
              </Button>
            </Link>
            <Link href="/tools/project-builder">
              <Button size="lg" variant="outline">
                Build a Project
              </Button>
            </Link>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your inbox.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

