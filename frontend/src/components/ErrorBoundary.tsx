import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Result, Button } from 'antd';


interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center p-6">
          <Result
            status="500"
            title="哎呀，出错了"
            subTitle="应用遇到了一个意外错误，我们正在努力修复。"
            extra={
              <Button type="primary" onClick={() => window.location.reload()}>
                重新加载页面
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

