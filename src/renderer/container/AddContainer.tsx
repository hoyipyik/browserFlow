import React, { useEffect, useState } from 'react'
import './addContainer.css'
import { Button, Input, TextField } from '@mui/material'
import { generateCurrentUrl, generateTime } from '../../util/record.util'
import { listItem } from '../types/common.odt'
import { useStore } from '../tools/store'

const AddContainer = () => {

    const [type, setType] = useState<string>('click')
    const [inputContent, setInputContent] = useState<string>('')

    const list: listItem[] = useStore(state => state.list)
    const setList = useStore(state => state.setList)
    const addIndex: number = useStore(state => state.addIndex)
    const setAddPageFlag = useStore(state => state.setAddPageFlag)

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputContent(e.target.value)
    }

    const selectorHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setType(e.target.value)
    }

    const itemGenerator = (type: string, inputContent: string) => {
        const recordItem = {
            // hash id
            id: generateTime().toString(),
            eventType: type,
            tagName: inputContent,
            innerText: '',
            rawHtml: '',
            value: '',
            cssSelector: '',
            timeStamp: generateTime(),
            url: generateCurrentUrl(),
            description: "",
            delay: 20000,
            autoDelay: false,
        };
        return recordItem;

    }

    const addHandler = () => {
        if (inputContent !== '') {
            const recordItem = itemGenerator(type, inputContent);
            let newList: listItem[] = [];
            if (addIndex !== -1) {
                newList = [...list.slice(0, addIndex), recordItem, ...list.slice(addIndex)];
            } else {
                newList = [...list, recordItem];
            }
            setList(newList);
            setAddPageFlag(false);
        }
    }

    const keydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === 'NumpadEnter') {
            addHandler();
            e.preventDefault();
        }
    }

    return (
        <div className='addContainer'>
            <div className="select">
                <div>EventType</div>
                <select
                    value={type}
                    onChange={selectorHandler}
                >
                    <option value="scroll">Scroll</option>
                    <option value="keydown">Keydown</option>
                    <option value="keyboard">Keyboard</option>
                    <option value="click">Click</option>
                    <option value="visit">Visit</option>
                    <option value="create">Create</option>
                    <option value="switch">Switch</option>
                </select>
            </div>
            <div className='addbar'>
                <div className='input'>
                    <TextField
                        onKeyDown={keydownHandler}
                        sx={{ width: '80%' }}
                        size="small" label={'TagName'}
                        value={inputContent} onChange={inputHandler} />
                </div>
                <div className='button'>
                    <Button
                        onClick={addHandler} size='small'
                        sx={{ marginLeft: '-3rem' }}
                    >Add</Button>
                </div>
            </div>
        </div>
    )
}

export default AddContainer