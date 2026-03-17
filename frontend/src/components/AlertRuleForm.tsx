import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Select, InputNumber, Button, Switch, Space } from 'antd';

interface AlertRuleFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AlertRuleForm: React.FC<AlertRuleFormProps> = ({ initialValues, onSubmit, onCancel }) => {
  const { control, handleSubmit } = useForm({

    defaultValues: initialValues || {
      name: '',
      metric: 'cpu',
      condition: '>',
      threshold: 80,
      enabled: true
    }
  });

  return (
    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
      <Form.Item label="规则名称">
        <Controller
          name="name"
          control={control}
          rules={{ required: '请输入规则名称' }}
          render={({ field, fieldState }) => (
            <>
              <Input {...field} placeholder="例如：CPU 使用率过高" status={fieldState.error ? 'error' : ''} />
              {fieldState.error && <span className="text-red-500 text-xs">{fieldState.error.message}</span>}
            </>
          )}
        />
      </Form.Item>

      <div className="grid grid-cols-3 gap-4">
        <Form.Item label="监控指标">
          <Controller
            name="metric"
            control={control}
            render={({ field }) => (
              <Select {...field} options={[
                { value: 'cpu', label: 'CPU' },
                { value: 'memory', label: '内存' },
                { value: 'disk', label: '磁盘' }
              ]} />
            )}
          />
        </Form.Item>

        <Form.Item label="条件">
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select {...field} options={[
                { value: '>', label: '大于' },
                { value: '<', label: '小于' }
              ]} />
            )}
          />
        </Form.Item>

        <Form.Item label="阈值">
          <Controller
            name="threshold"
            control={control}
            render={({ field }) => <InputNumber {...field} className="w-full" />}
          />
        </Form.Item>
      </div>

      <Form.Item label="启用状态">
        <Controller
          name="enabled"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch checked={value} onChange={onChange} />
          )}
        />
      </Form.Item>

      <Form.Item className="mb-0 text-right">
        <Space>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">保存规则</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AlertRuleForm;
