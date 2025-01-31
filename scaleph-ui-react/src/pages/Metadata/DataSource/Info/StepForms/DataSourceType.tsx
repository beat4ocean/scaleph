import {useEffect, useRef, useState} from "react";
import {useModel} from "@umijs/max";
import {Image} from "antd";
import {ActionType, ProFormInstance, ProList, ProListMetas} from "@ant-design/pro-components";
import {DsType} from "@/services/datasource/typings";
import {DsCategoryService} from "@/services/datasource/category.service";

const DataSourceTypeWeb: React.FC<{ categoryId?: number, onTypeSelect: () => void }> = ({
                                                                                                    categoryId,
                                                                                                    onTypeSelect
                                                                                                  }) => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const {setDsType} = useModel('dataSourceType', (model) => ({
    setDsType: model.setDsType
  }));

  const [searchValue, setSearchValue] = useState<string | undefined>()

  useEffect(() => {
    actionRef.current?.reload(true)
  }, [categoryId, searchValue])

  const metas: ProListMetas<DsType> = {
    title: {
      dataIndex: "type",
      render: (dom, entity, index, action, schema) => {
        return entity.type.label
      }
    },
    content: {
      dataIndex: "logo",
      render: (dom, entity, index, action, schema) => {
        return <Image alt={entity.type.label} preview={false} src={entity.logo}></Image>
      }
    }
  }

  return (
    <ProList
      toolbar={{
        search: {
          onSearch: (value: string) => {
            setSearchValue(value)
          }
        }
      }}
      rowKey="id"
      actionRef={actionRef}
      formRef={formRef}
      options={false}
      metas={metas}
      request={(params, sort, filter) => {
        return DsCategoryService.listTypes({...params, categoryId: categoryId, type: searchValue})
      }}
      pagination={false}
      grid={{gutter: 8, column: 6}}
      split={true}
      onItem={(record) => {
        return {
          onClick: () => {
            setDsType(record)
            onTypeSelect()
          }
        };
      }}
    />);
}

export default DataSourceTypeWeb;
