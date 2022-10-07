import { useState } from "react";
import { CopyBlock, dracula } from "react-code-blocks";
import "./App.css";

type UnknownObject = { [key: string]: unknown };

const mockArray = [
  {
    postId: 1,
    id: 1,
    name: "id labore ex et quam laborum",
    email: "Eliseo@gardner.biz",
    body: "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium",
  },
  {
    postId: 1,
    id: 2,
    test: "dfsfd sdf sdf ds dsf",
    notCommonKey: 12312,
    name: "quo vero reiciendis velit similique earum",
    email: "Jayne_Kuhic@sydney.com",
    body: "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et",
  },
  {
    postId: 1,
    id: 2,
    test: "dfsfd sdf sdf ds dsf",
    notCommonKey: 12312,
    name: "quo vero reiciendis velit similique earum",
    email: "Jayne_Kuhic@sydney.com",
    body: "est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et",
  },
];

const obj1 = {
  a: "test",
  b: [1, 2, 3, 4],
  c: ["test", "fhfdbh"],
  d: ["test", 22, "fhfdbh", 1, 2, 3],
  e: true,
  f: null,
};

const obj2 = {
  postId: 1,
  id: 1,
  name: "id labore ex et quam laborum",
  email: "Eliseo@gardner.biz",
  body: "laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium",
};

const complexMock = {
  x: mockArray,
  obj1: {
    xx: {
      xxx: {
        xxxx: obj1,
      },
    },
  },
};

export const converter = (object: any) => {
  if (object === null) return;

  const res = Object.entries(object).reduce(
    (acc: UnknownObject, [key, value]: [string, unknown]) => {
      if (typeof value === "string" || typeof value === "number") {
        console.log(value, Object.keys(object));

        acc[key] = (typeof value).toString();
      } else if (value === null) {
        acc[key] = value;
      } else if (typeof value === "object" && Array.isArray(value)) {
        const isArrayOfStrings = value.every((v) => typeof v === "string");

        const isArrayOfNumbers = value.every((v) => typeof v === "number");

        const isMixedArray =
          value.some((v) => typeof v === "number") &&
          value.some((v) => typeof v === "string");

        if (isArrayOfStrings) {
          acc[key] = "string[]";
        } else if (isArrayOfNumbers) {
          acc[key] = "number[]";
        } else if (isMixedArray) {
          acc[key] = "(string|number)[]";
        } else {
          const { optionalKeys, requiredKeys } = getKeys(value);
          const itemWithAllKeys = getItemWithAllKeys(value, optionalKeys);
          acc[key] = converter(itemWithAllKeys);
        }
      } else if (typeof value === "object" && !Array.isArray(value)) {
        acc[key] = converter(value);
      } else {
        acc[key] = typeof value;
      }

      return acc;
    },
    {}
  );

  return res;
};

const compareObjects = (obj1: UnknownObject, obj2: UnknownObject) => {
  const x = Object.keys(obj1).length > Object.keys(obj2).length;
  const longerObj = x ? obj1 : obj2;
  const shorterObj = x ? obj2 : obj1;

  const optionalKeys: unknown[] = [];
  const requiredKeys: unknown[] = [];
  Object.keys(longerObj).forEach((key) => {
    if (!shorterObj.hasOwnProperty(key)) {
      return optionalKeys.push(key);
    }
    return requiredKeys.push(key);
  });
  return { optionalKeys, requiredKeys };
};

function getKeys(arr: UnknownObject[]): {
  optionalKeys: string[];
  requiredKeys: string[];
} {
  if (!arr) {
    return {
      optionalKeys: [] as string[],
      requiredKeys: [] as string[],
    };
  }

  const optionalKeysUnique = new Set();
  const requiredKeysUnique = new Set();
  for (var i = 1; i < arr.length; i++) {
    const { optionalKeys, requiredKeys } = compareObjects(arr[0], arr[i]);
    optionalKeys.forEach((optionalKey) => optionalKeysUnique.add(optionalKey));
    requiredKeys.forEach((requiredKey) => requiredKeysUnique.add(requiredKey));
  }
  return {
    optionalKeys: [...optionalKeysUnique] as string[],
    requiredKeys: [...requiredKeysUnique] as string[],
  };
}

function getItemWithAllKeys(arr: UnknownObject[], optionalKeys: string[]) {
  let res = null;
  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    const found = Object.keys(item).some((r) => optionalKeys.includes(r));

    if (found) {
      res = item;
      break;
    }
  }

  return res;
}

function App() {
  const getInfo = (toConvert: unknown) => {
    if (typeof toConvert === "object" && Array.isArray(toConvert)) {
      const { optionalKeys, requiredKeys } = getKeys(toConvert);
      const itemWithAllKeys = getItemWithAllKeys(toConvert, optionalKeys);

      return JSON.stringify(converter(itemWithAllKeys), null, 4).replace(
        /\"/g,
        ""
      );
    }
    return JSON.stringify(converter(toConvert), null, 4).replace(/\"/g, "");
  };

  return (
    <div className="App">
      {/* <pre>{getInfo(obj)}</pre> */}
      {/* <CopyBlock
        language={"javascript"}
        text={JSON.stringify(mock, null, 4)}
        showLineNumbers={true}
        theme={dracula}
        wrapLines={true}
        codeBlock
      /> */}
      <CopyBlock
        language={"typescript"}
        text={getInfo(mockArray)}
        showLineNumbers={true}
        theme={dracula}
        wrapLines={true}
        codeBlock
      />
    </div>
  );
}

export default App;
